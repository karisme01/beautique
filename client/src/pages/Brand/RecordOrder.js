import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import BrandMenu from '../../components/Layout/BrandMenu';


const RecordOrder = () => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [productID, setProductID] = useState('');
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [productSize, setProductSize] = useState('');
  const [purchaseType, setPurchaseType] = useState('');
  const [isInsured, setIsInsured] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [lastScannedBarcode, setLastScannedBarcode] = useState('');

    const handleBarcodeDetected = (data) => {
        console.log(data);
        if (data.codeResult.code) {
            setLastScannedBarcode(data.codeResult.code);
            // You can also directly call fetchProduct(data.codeResult.code) here
        }
    };

  const recordOrder = async () => {
    if (!selectedCustomer) {
      alert('No customer selected!');
      return;
    }
    const orderData = {
      user: selectedCustomer?._id,
      items: orderProducts.map(product => ({
        product: product?._id, 
        purchaseType: product.purchaseType,
        size: product.size,
        insured: product.insured,
        reserved: false, 
      })),
    };
  
    try {
      const response = await axios.post('/api/v1/order/create-order-brand', orderData); 
      if (response.data) { 
        alert('Order recorded successfully!');
        // Reset state as needed or redirect
      }
    } catch (error) {
      console.error("Error recording order:", error);
    }
  };

  useEffect(() => {
    console.log(selectedCustomer)
  }, [selectedCustomer]);
  

  const calculateTotalPrice = () => {
    return orderProducts.reduce((acc, product) => acc + parseFloat(product.price), 0).toFixed(2);
  };

  const fetchCustomers = async (query) => {
    try {
      const response = await axios.get(`/api/v1/brand/search-user?name=${query}`);
      setCustomerResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomerResults([]);
    }
  };

  const handleCustomerSearchChange = (e) => {
    setCustomerSearch(e.target.value);
    fetchCustomers(e.target.value);
  };

  const handleCustomerSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers(customerSearch);
  };

  const handleClearSelection = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setCustomerResults([]);
    setOrderProducts([])
  };

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`/api/v1/product/get-product-id/${id}`);
      setFetchedProduct(response.data?.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      setFetchedProduct(null);
    }
  };

  const removeProduct = (index) => {
    const newOrderProducts = orderProducts.filter((_, productIndex) => index !== productIndex);
    setOrderProducts(newOrderProducts);
  };
  

  const handleProductIDSubmit = (e) => {
    e.preventDefault();
    fetchProduct(productID);
  };

  const addProductToOrder = () => {
    let finalPrice = fetchedProduct.price; // Start with the product's original price
  
    // Adjust price based on the purchaseType
    if (purchaseType === '1') { // If 4-day lease is selected
      finalPrice *= 0.3;
    } else if (purchaseType === '2') { // If 7-day lease is selected
      finalPrice *= 0.4;
    }
    if (isInsured) {
      finalPrice *= 1.1; 
    }
  
    const newProduct = {
      ...fetchedProduct,
      size: productSize,
      purchaseType,
      insured: isInsured,
      price: finalPrice.toFixed(0), 
    };
  
    setOrderProducts([...orderProducts, newProduct]);
    setProductID('');
    setFetchedProduct(null);
    setProductSize('');
    setPurchaseType('');
    setIsInsured(false);
  };
  

  return (
    <Layout title={'Dashboard - All Orders'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu />
          </div>
          <div className='col-md-9' style={{marginTop: '24px'}}>
            {!selectedCustomer && (
              <>
                <form onSubmit={handleCustomerSearchSubmit} className='mb-3'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <div className='input-group'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Search Customer by Name'
                          value={customerSearch}
                          onChange={handleCustomerSearchChange}
                        />
                        <button className='btn btn-outline-secondary' type='submit'>Search</button>
                      </div>
                    </div>
                  </div>
                </form>
                <ul className='list-group' style={{ width: '700px' }}>
                  {customerResults.map((customer) => (
                    <li
                      key={customer.id}
                      className='list-group-item list-group-item-action'
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {selectedCustomer && (
              <>
                <div className='alert mt-3' style={{ width: '700px', backgroundColor: '#f7f4f1'}}>
                  Selected Customer: <strong>{selectedCustomer.name}</strong>
                  <button onClick={handleClearSelection} className='btn btn-light ms-2' style={{ borderWidth: '1px', borderColor: 'black'}}>Change Customer</button>
                </div>
                <form onSubmit={handleProductIDSubmit} className='mb-3' style={{marginTop: '25px'}}>
                  <input
                    type='text'
                    className='form-control mb-2'
                    placeholder='Enter Product ID'
                    value={productID}
                    onChange={(e) => setProductID(e.target.value)}
                    style={{width: '67%'}}
                  />
                  <button type='submit' className='btn' style={{backgroundColor: '#353839', color: 'white'}}>Fetch Product</button>
                </form>
                {fetchedProduct && (
                  <div className='mb-3'>
                    <select
                      className='form-control mb-2'
                      value={productSize}
                      onChange={(e) => setProductSize(e.target.value)}
                      style={{width: '67%'}}
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>

                    <select
                      className='form-control mb-2'
                      value={purchaseType}
                      onChange={(e) => setPurchaseType(e.target.value)}
                      style={{width: '67%'}}
                    >
                      <option value="">Select Purchase Type</option>
                      <option value="0">Buy</option>
                      <option value="1">4-day lease</option>
                      <option value="2">7-day lease</option>
                    </select>

                    <div className='form-check mb-2'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={isInsured}
                        onChange={(e) => setIsInsured(e.target.checked)}
                        id='flexCheckDefault'
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        Insured
                      </label>
                    </div>
                    <button onClick={addProductToOrder} className='btn btn-success'>Add Product</button>
                  </div>
                )}
                {orderProducts.length > 0 && (
                <div style={{marginTop: '40px'}}>
                  <h5>Products in Order:</h5>
                  <table className="table" style={{width: '80%'}}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Purchase Type</th>
                        <th>Insured</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts.map((product, index) => {
                        const purchaseTypeText = product.purchaseType === '0' ? 'Buy' :
                                                product.purchaseType === '1' ? '4-day lease' :
                                                product.purchaseType === '2' ? '7-day lease' : 'Unknown';
                        return (
                          <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.size}</td>
                            <td>{purchaseTypeText}</td>
                            <td>{product.insured ? 'Yes' : 'No'}</td>
                            <td>Rs {product.price}</td> {/* Assuming you have price in your product object */}
                            <td>
                              <button onClick={() => removeProduct(index)} style={{border: 'none', background: 'none'}}>
                                ❌
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                        <tr>
                          <th colSpan="4">Total Price</th>
                          <th>Rs {calculateTotalPrice()}</th>
                        </tr>
                      </tfoot>
                  </table>
                  <button 
                    onClick={recordOrder} 
                    className="btn" 
                    style={{ marginTop: '20px', marginLeft: '560px', backgroundColor: '#353839', color: 'white'}}
                  >
                    Record Payment and Checkout
                  </button>
                  
                </div>
              )}

              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecordOrder;
