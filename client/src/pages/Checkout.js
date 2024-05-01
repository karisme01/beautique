import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import { useCart } from "../context/cart";
import { useReserve } from "../context/reserve";
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import TopSlider from '../components/Designs/TopSlider';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, List, Radio, Input, Button} from 'antd';

const Checkout = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [reserve, setReserve] = useReserve();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const user = auth?.user;
  const [addresses, setAddresses] = useState(auth?.user?.address)
  const [selectedAddress, setSelectedAddress] = React.useState(auth?.user?.address[0]);
  const [newAddress, setNewAddress] = React.useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [addingNewAddress, setAddingNewAddress] = React.useState(false);

  const getAddresses = async () => {
    try {
      const { response } = await axios.get(`/api/v1/auth/get-addresses/${auth?.user?._id}`);
      setAddresses(response)
      console.log(response)
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  }

  // useEffect(() => {
  //   getAddresses();
  // }, [auth]);


  const toggleAddAddress = () => {
    setAddingNewAddress(!addingNewAddress);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddAddress = async () => {
    try {
      if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
        toast.error("Please fill all the address fields.");
        return;
      }
      const response = await axios.post(`/api/v1/auth/add-address/${auth?.user?._id}`, { address: newAddress });
      if (response.status === 200) {
        toast.success("Address added successfully");
        setAddingNewAddress(false) 
        setIsModalVisible(false);
        setSelectedAddress(newAddress);
        setAddresses(response?.data?.user?.address)
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      toast.error("Error adding address");
    }
  };

  const showModal = () => {
    console.log(user?.address[0])
    setIsModalVisible(true);
};

  const handleOk = () => {
      setIsModalVisible(false);
      // Implement logic to update the address if needed
  };
 
  const handleCancel = () => {
      setIsModalVisible(false);
  };

  const onChangeAddress = (e) => {
      setSelectedAddress(e.target.value);
  };

  const calculateReturnDate = (selectedDate, purchaseType) => {
    if (!selectedDate) return ''; 
    const baseDays = purchaseType === '1' ? 4 : 7;
    return moment(selectedDate).add(baseDays, 'days').format('YYYY-MM-DD');
  };

  const totalCombinedPrice = () => {
    const calculateItemPrice = ([product, , type, insured, quantity]) => {
      let basePrice = product.price;
      if (type === '1') basePrice *= 0.3; 
      else if (type === '2') basePrice *= 0.4;
      return basePrice * (insured ? 1.10 : 1) * quantity;
    };

    const cartTotal = cart.reduce((total, item) => total + calculateItemPrice(item), 0);
    const reserveTotal = reserve.reduce((total, item) => total + calculateItemPrice(item), 0);
    return cartTotal + reserveTotal;
  };

  const subtotal = totalCombinedPrice();
  const salesTax = (subtotal) => (subtotal * 0.05).toFixed(2);
  const deliveryFee = 150;
  const totalAmount = subtotal + parseFloat(salesTax(subtotal)) + deliveryFee;

  const createOrder = async () => {
    try {
      if (cart.length === 0 && reserve.length === 0){
        toast.error("Your cart is empty"); 
        return;
      } 
      const userId = auth?.user?._id; 
      const orderItems = [...cart, ...reserve].map(item => ({
        product: item[0]._id,
        brandId: item[0].brand,
        userId: userId, 
        shipping_address: selectedAddress,
        purchaseType: item[2],
        size: item[1],
        insured: item[3],  
        reserved: item.length > 5 ? true : false, 
        reserveDate: item.length > 5 ? item[5] : undefined, 
        collectedDate: '0',
        returnDate: '0',
        status: 'Production'
      }));
      const orderData = {
        user: userId,
        items: orderItems,  
      }; 
      const response = await axios.post('/api/v1/order/create-order', orderData);
      if (response.status === 201) {
        toast.success("Order placed successfully");
        setCart([]);
        setReserve([]);
        localStorage.setItem("cart", JSON.stringify([]))
        localStorage.setItem("reserve", JSON.stringify([]))
        navigate('/about')
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("An error occurred while placing the order");
    }
  };

  return (
    <Layout>
      <TopSlider items={[
        { id: 1, content: "Free Delivery over Rs 4000" },
        { id: 2, content: "Hassle-free return process" },
        { id: 3, content: "Greater quality, lower price" }
      ]} />
      <div className='text-center top-text'>
        <p>THANK YOU FOR EXPLORING FASHION WITH US</p>
      </div>
      <div className='checkout-layout' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="table-container" style={{ width: '65%', margin: '20px' }}>
          {/* Table for cart items */}
          <div className="table-responsive">
            <table className="table cart-table">
              <thead style={{ backgroundColor: '#F0F0F0', height: '60px', borderColor: '#E8E8E8' }}>
                <tr>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8'}}>Product</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8', textAlign: 'center'}}>Totals</th>
                </tr>
              </thead>
              <tbody style={{fontSize: '14px'}}>
                {cart.map(([product, size, type, insuredBoolean, quantity], index) => (
                  <tr key={index}>
                    <td>
                      <div style={{display: 'flex', flexDirection: 'row', width: '350px'}}>
                        <img
                          src={`/api/v1/product/product-photo/${product._id}`}
                          alt={product.name}
                          style={{ height: '150px', width: '120px', marginRight: '20px', cursor: 'pointer'}}
                          onClick={() => navigate(`/product/${product.slug}`)}
                        />
                        <div>
                          <div style={{marginRight: '-100px'}}>{product.name}</div>
                          <div>Color: {product.color}</div>
                          <div>Size: {size}</div>
                          <div>Retail Price: Rs {product.price}</div>
                          <div>Purchase type: {type === '0' ? 'Buy' : type === '1' ? '4-day Lease' : '7-day Lease'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      Rs {(type === '0' ? product.price * quantity : type === '1' ? 0.3 * product.price * quantity : 0.4 * product.price * quantity) * (insuredBoolean ? 1.10 : 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reserve && reserve.length > 0 && (
          <div className="table-responsive">
              <table className="table cart-table">
              <thead style={{ backgroundColor: '#F0F0F0', height: '60px', borderColor: '#E8E8E8' /* Lighter border color */ }}>
                <tr>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8'}}>Product</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8', textAlign: 'center'}}>Totals</th>
                </tr>
              </thead>

                <tbody style={{fontSize: '14px'}}>
                  {reserve.map(([product, size, type, insuredBoolean, quantity, reserveDate], index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>
                          <div style={{display:'flex', flexDirection: 'row', width: '350px'}}>
                            <img
                              src={`/api/v1/product/product-photo/${product._id}`}
                              alt={product.name}
                              style={{ height: '150px', width: 'auto', marginRight: '20px', cursor: 'pointer'}}
                              onClick={() => navigate(`/product/${product.slug}`)}
                            />
                          <div>
                          <div style={{marginRight: '-100px'}}>{product.name}</div>
                          <div>Color: {product.color}</div>
                          <div>Size: {size}</div>
                            Retail Price: <h7>Rs {product.price}</h7>
                          <div style={{width: '300px'}}>Reserved delivery date: <strong>{reserveDate}</strong></div>
                          <br/>
                          <div style={{width: '300px', marginTop: '-20px', fontSize: '14px'}}>*Return by: <strong>{calculateReturnDate(reserveDate, type)}</strong></div>
                          </div>
                          </div>
                        </td>
                        
                        <td style={{textAlign: 'center'}}>
                          Rs {
                            (type === '0' ? product.price * quantity : 
                              type === '1' ? 0.3 * product.price * quantity : 
                              0.4 * product.price * quantity) * 
                            (insuredBoolean ? 1.10 : 1)
                          }
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table> 
            </div>
          )} 
        </div>
        
        <div className="invoice-and-address" style={{ width: '35%', margin: '20px', display: 'flex', flexDirection: 'column', marginRight: '5%', marginLeft: '-2%'}}>
          <div className="invoice-panel" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '0px', background: '#f9f9f9', marginBottom: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Order Summary</h2>
            <div className="invoice-details">
              <p><strong>Subtotal:</strong> <span style={{ float: 'right' }}>Rs {subtotal.toFixed(2)}</span></p>
              <p><strong>Sales Tax (5%):</strong> <span style={{ float: 'right' }}>Rs {salesTax(subtotal)}</span></p>
              <p><strong>Delivery Fee:</strong> <span style={{ float: 'right' }}>Rs {deliveryFee.toFixed(2)}</span></p>
              <h6 style={{ borderTop: '2px solid #ccc', paddingTop: '10px' }}><strong>Total:</strong> <span style={{ float: 'right' }}>Rs {totalAmount.toFixed(2)}</span></h6>
            </div>
          </div>
          <div className="address-panel" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '0px', background: '#f9f9f9' }}>
            <FontAwesomeIcon icon={faEdit} onClick={showModal} style={{ position: 'relative', top: '0%', left: '95%', cursor: 'pointer', fontSize: '140%'}}/>
            <h2 style={{marginTop: '-10px'}}>Shipping Address</h2>
            {auth.user?.address[0] && selectedAddress ? (
              <div>
                <p>{selectedAddress?.street}</p>
                <p>{selectedAddress?.city}</p>
                <p>{selectedAddress?.state}</p>
                <p>{selectedAddress?.zipCode}</p>
              </div>
            ) : (
              <p>No address provided</p>
            )}
          </div>
          <div className='pay-btn-container'>
            <button className='pay-btn' onClick={()=>createOrder()}>
              PAY NOW
            </button>
          </div>
        </div> 
      </div>
      {/* <Modal title="Choose Address" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} style={{borderRadius: '0px'}}>
      <List
          dataSource={user?.address}
          renderItem={address => (
              <List.Item>
                  <Radio.Group onChange={onChangeAddress} value={selectedAddress}>
                      <Radio value={address}>
                          {address.street}, {address.city}, {address.state} - {address.zipCode}
                      </Radio>
                  </Radio.Group>
              </List.Item>
          )}
      />
      </Modal> */}
      <Modal
        title={addingNewAddress ? "Add New Address" : "Choose Address"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          addingNewAddress ?
          <Button key="submit" type="primary" onClick={handleAddAddress}>
            Add Address
          </Button> :
          <Button key="submit" type="primary" onClick={handleOk}>
            Select Address
          </Button>
        ]}
      >
          <List
            dataSource={addresses}
            renderItem={address => (
              <List.Item>
                <Radio.Group onChange={onChangeAddress} value={selectedAddress}>
                  <Radio value={address}>
                    {address.street}, {address.city}, {address.state} - {address.zipCode}
                  </Radio>
                </Radio.Group>
              </List.Item>
            )}
          />
          {addingNewAddress &&
          <>
            <Input
              placeholder="Street"
              name="street"
              value={newAddress.street}
              onChange={handleChange}
              style={{ marginBottom: 8 }}
            />
            <Input
              placeholder="City"
              name="city"
              value={newAddress.city}
              onChange={handleChange}
              style={{ marginBottom: 8 }}
            />
            <Input
              placeholder="State"
              name="state"
              value={newAddress.state}
              onChange={handleChange}
              style={{ marginBottom: 8 }}
            />
            <Input
              placeholder="Zip Code"
              name="zipCode"
              value={newAddress.zipCode}
              onChange={handleChange}
            />
          </>
        }
        {!addingNewAddress && 
          <Button onClick={toggleAddAddress}>
            Add new address
          </Button>
        }
        
      </Modal>
      

    </Layout>
  );
};

export default Checkout;

