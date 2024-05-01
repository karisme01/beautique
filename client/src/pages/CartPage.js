import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useReserve } from "../context/reserve";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { useWish } from "../context/wish";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartPage.css";
import StarRating from "../components/Designs/Stars";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import moment from "moment";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [reserve, setReserve] = useReserve()
  const [insured, setInsured] = useState([])
  const navigate = useNavigate();
  const [wish, setWish] = useWish()

  const updatePurchaseType = (index, newType) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        const newInsured = newType === '0' ? false : item[3];
        return [
          item[0], 
          item[1], 
          newType,
          newInsured,
          item[4]  
        ];
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updatePurchaseTypeReserve = (index, newType) => {
    const updatedReserve = reserve.map((item, idx) => {
      if (idx === index) {
        const newInsured = newType === '0' ? false : item[3];
        return [
          item[0], 
          item[1], 
          newType,
          newInsured,
          item[4], 
          item[5]
        ];
      }
      return item;
    });
    setReserve(updatedReserve);
    localStorage.setItem("reserve", JSON.stringify(updatedReserve));
  };
  
  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };
  

  const updateQuantity = (index, newQuantity) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        // Assuming the quantity is the fifth element in the array
        return [...item.slice(0, 4), parseInt(newQuantity)];
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantityReserve = (index, newQuantity) => {
    const updatedReserve = reserve.map((item, idx) => {
      if (idx === index) {
        // Assuming the quantity is the fifth element in the array
        return [...item.slice(0, 4), parseInt(newQuantity)];
      }
      return item;
    });
    setReserve(updatedReserve);
    localStorage.setItem("reserve", JSON.stringify(updatedReserve));
  };

  const updateInsured = (index) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        const newInsured = !item[3];
        return [...item.slice(0, 3), newInsured, ...item.slice(4)];
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateInsuredReserve = (index) => {
    const updatedReserve = reserve.map((item, idx) => {
      if (idx === index) {
        const newInsured = !item[3];
        return [...item.slice(0, 3), newInsured, ...item.slice(4)];
      }
      return item;
    });
    setReserve(updatedReserve);
    localStorage.setItem("reserve", JSON.stringify(updatedReserve));
  };

  const calculateReturnDate = (selectedDate, purchaseType) => { 
    if (!selectedDate) return ''; // No selected date provided
    const baseDays = purchaseType === '1' ? 4 : 7; // 4 days for purchaseType '1', 7 days for '2'
    const returnDate = moment(selectedDate).add(baseDays, 'days');
    return returnDate.format('YYYY-MM-DD'); // Format the date as needed
};
  

  // Total price calculation
  const totalCombinedPrice = () => {
    const calculateItemPrice = ([product, , type, insured, quantity]) => {
      let basePrice = product.price;
      if (type === '1') {
        basePrice *= 0.3; 
      } else if (type === '2') {
        basePrice *= 0.4; 
      }
      return basePrice * (insured ? 1.10 : 1) * quantity;
    };
  
    const cartTotal = cart.reduce((total, item) => total + calculateItemPrice(item), 0);
    const reserveTotal = reserve.reduce((total, item) => total + calculateItemPrice(item), 0);
  
    return (cartTotal + reserveTotal).toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };
  
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
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("An error occurred while placing the order");
    }
  };
  
  

  // Remove item from cart
  const removeCartItem = (pid, sizeToRemove, typeToRemove, insuredRemove, quantityRemove) => {
    console.log(pid, sizeToRemove, typeToRemove, insuredRemove, quantityRemove)
    const updatedCart = cart.filter(([product, size, selectedType, insured, quantity]) => {
        return !(product._id === pid && size === sizeToRemove && selectedType === typeToRemove 
            && insured === insuredRemove && quantity === quantityRemove);
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const removeReserveItem = (pid, sizeToRemove, typeToRemove, insuredRemove, quantityRemove) => {
    console.log(pid, sizeToRemove, typeToRemove, insuredRemove, quantityRemove)
    const updatedReserve = reserve.filter(([product, size, selectedType, insured, quantity]) => {
        return !(product._id === pid && size === sizeToRemove && selectedType === typeToRemove 
            && insured === insuredRemove && quantity === quantityRemove);
    });
    setReserve(updatedReserve);
    localStorage.setItem("reserve", JSON.stringify(updatedReserve));
    toast.success('Item removed from reserve');
  };

  const moveToWishlist = (p, sizeToRemove, typeToRemove, insuredRemove, quantityRemove) => {
    const isInWishList = isProductInWishList(p);
    if (isInWishList) {
      toast.success('Item already there in wishlist');
    } else {
      const newWish = [...wish, p];
      setWish(newWish);
      const updatedCart = cart.filter(([product, size, selectedType, insured, quantity]) => {
        return !(product._id === p._id && size === sizeToRemove && selectedType === typeToRemove 
            && insured === insuredRemove && quantity === quantityRemove);
      });
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem("wish", JSON.stringify(newWish));
      toast.success('Item moved to wishlist');
    }
  }

  const moveToWishlistReserve = (p, sizeToRemove, typeToRemove, insuredRemove, quantityRemove) => {
    const isInWishList = isProductInWishList(p);
    if (isInWishList) {
      toast.success('Item already there in wishlist');
    } else {
      const newWish = [...wish, p];
      const updatedReserve = reserve.filter(([product, size, selectedType, insured, quantity]) => {
        return !(product._id === p._id && size === sizeToRemove && selectedType === typeToRemove 
            && insured === insuredRemove && quantity === quantityRemove);
      });
      setReserve(updatedReserve);
      localStorage.setItem("reserve", JSON.stringify(updatedReserve));
      setWish(newWish);
      localStorage.setItem("wish", JSON.stringify(newWish));
      toast.success('Item moved to wishlist');
    }
  }


  return (
    <Layout>  
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
              <p className="text-center">
              {cart.length || reserve.length? `You Have ${cart.length + reserve.length} items in your cart` : "Your Cart Is Empty"}
              </p> 
            </h1>
          </div>
        </div>

        <div style={{marginLeft: '1032px', marginTop: '30px', marginBottom: '-20px'}}>
          <button className="shadow-lg" onClick={() => navigate('/checkout')}
            style={{
              backgroundColor: '#65081f', color: 'white', padding: '10px 20px', fontSize: '16px', 
              border: 'none', cursor: 'pointer', 
            }}
          > PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="list-container" style={{ marginLeft: '50px', marginRight: '40px' }}>
          <div className="row">
            <div className="table-responsive">
              <table className="table cart-table">
              <thead style={{ backgroundColor: '#F0F0F0', height: '60px', borderColor: '#E8E8E8' /* Lighter border color */ }}>
                <tr>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8'}}>Product</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8' , textAlign: 'center'}}>Edit</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8', textAlign: 'center'}}>Totals</th>
                </tr>
              </thead>

                <tbody>
                  {cart.map(([product, size, type, insuredBoolean, quantity], index) => (
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
                          Retail Price: <h7>{product.price}</h7>
                          <br/>
                          </div>
                          </div>
                        </td>
                        {/* <td>
                          Retail Price: <h7>{product.price}</h7>
                        </td> */}
                        <td style={{textAlign: 'center'}}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '10px'}}>
                            <button
                              onClick={() => updateQuantity(index, Math.max(1, quantity - 1))}
                              style={{cursor: 'pointer',marginRight: '5px', width: '20px',
                                backgroundColor: 'grey', color: 'white', marginRight: '8px'}}
                            >-</button>
                            
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => updateQuantity(index, Math.max(1, parseInt(e.target.value)))}
                              style={{ 
                                width: '40px', 
                                textAlign: 'center',
                                marginRight: '5px',
                                borderRadius: '5px',
                                borderWidth: '0.3px'
                              }}
                              min="1"
                            />
                            
                            <button
                              onClick={() => updateQuantity(index, quantity + 1)}
                              style={{
                                cursor: 'pointer', width: '20px', height: '30px', backgroundColor: 'grey', 
                                color: 'white', marginLeft: '3px'
                              }}
                            >+</button>
                        </div>


                          <br/>
                          <select
                            value={type}
                            onChange={(e) => updatePurchaseType(index, e.target.value)}
                            style={{ marginLeft: '10px', marginBottom: '10px'}}
                          >
                            <option value="0">Buy</option>
                            <option value="1">4-day lease</option>
                            <option value="2">7-day lease</option>
                          </select>
                          <br/>
                          <input
                            type="checkbox"
                            checked={insuredBoolean}
                            onChange={() => updateInsured(index)}
                            disabled={type === '0'}
                            style={{ transform: 'scale(1.5)', cursor: 'pointer', 
                              marginRight: '10px', accentColor: '#404040', marginLeft: '5px'}} // Added right margin to the checkbox
                          />
                          <span>Insure</span>
                          <br/>
                          <div style={{fontSize: '14px', marginTop: '10px', cursor: 'pointer'}} 
                            onClick={()=>removeCartItem(product._id, size, type, insuredBoolean, quantity)}>
                            <RiDeleteBin5Line style={{fontSize: '20px'}}/> <h7>Remove</h7>
                          </div>
                          <br/>

                          <div style={{fontSize: '14px', marginTop: '-14px', cursor: 'pointer'}} 
                            onClick={()=>moveToWishlist(product, size, type, insuredBoolean, quantity)}>
                            <CiHeart style={{fontSize: '20px'}}/> <h7>Move to wishlist</h7>
                          </div>
                        </td>
                        <td style={{textAlign: 'center'}}>
                          {(
                            (type === '0' ? product.price * quantity : 
                              type === '1' ? 0.3 * product.price * quantity : 
                              0.4 * product.price * quantity) * 
                            (insuredBoolean ? 1.10 : 1)
                          ).toLocaleString("en-US", { style: "currency", currency: "INR" })}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <div className="insurance-info" style={{ fontSize: '0.8rem', color: '#666' }}>
                            <strong>*Note:</strong> Insuring the items with Rs{( type === '1' ? 0.03 * product.price * quantity : 
                              0.04 * product.price * quantity)} will ensure that if the item is damaged, 
                            Karisme will incur 50% of the cost.
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              
            </div>
          </div>
        </div>

      {reserve && reserve.length > 0 && (
        <div className="list-container" style={{ marginLeft: '50px', marginRight: '40px', marginTop: '0px'}}>
          <div style={{marginLeft: '130px', fontSize: '25px'}}>RESERVATIONS</div>
          <div className="row">
            <div className="table-responsive">
              <table className="table cart-table">
              <thead style={{ backgroundColor: '#F0F0F0', height: '60px', borderColor: '#E8E8E8' /* Lighter border color */ }}>
                <tr>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8'}}>Product</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8' , textAlign: 'center'}}>Edit</th>
                  <th scope="col" style={{ borderBottom: '2px solid #E8E8E8', textAlign: 'center'}}>Totals</th>
                </tr>
              </thead>

                <tbody>
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
                            Retail Price: <h7>{product.price}</h7>
                          <div style={{width: '300px'}}>Reserved delivery date: <strong>{reserveDate}</strong></div>
                          <br/>
                          <div style={{width: '300px', marginTop: '-20px', fontSize: '14px'}}>*Return by: <strong>{calculateReturnDate(reserveDate, type)}</strong></div>
                          </div>
                          </div>
                        </td>
                        {/* <td>
                          Retail Price: <h7>{product.price}</h7>
                        </td> */}
                        <td style={{textAlign: 'center'}}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '10px'}}>
                            <button
                              onClick={() => updateQuantityReserve(index, Math.max(1, quantity - 1))}
                              style={{cursor: 'pointer',marginRight: '5px', width: '20px',
                                backgroundColor: 'grey', color: 'white', marginRight: '8px'}}
                            >-</button>
                            
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => updateQuantityReserve(index, Math.max(1, parseInt(e.target.value)))}
                              style={{ 
                                width: '40px', 
                                textAlign: 'center',
                                marginRight: '5px',
                                borderRadius: '5px',
                                borderWidth: '0.3px'
                              }}
                              min="1"
                            />
                            
                            <button
                              onClick={() => updateQuantityReserve(index, quantity + 1)}
                              style={{
                                cursor: 'pointer', width: '20px', height: '30px', backgroundColor: 'grey', 
                                color: 'white', marginLeft: '3px'
                              }}
                            >+</button>
                        </div>


                          <br/>
                          <select
                            value={type}
                            onChange={(e) => updatePurchaseTypeReserve(index, e.target.value)}
                            style={{ marginLeft: '10px', marginBottom: '10px'}}
                          >
                            {/* <option value="0">Buy</option> */}
                            <option value="1">4-day lease</option>
                            <option value="2">7-day lease</option>
                          </select>
                          <br/>

                          <input
                            type="checkbox"
                            checked={insuredBoolean}
                            onChange={() => updateInsuredReserve(index)}
                            disabled={type === '0'}
                            style={{ transform: 'scale(1.5)', cursor: 'pointer', 
                              marginRight: '10px', accentColor: '#404040', marginLeft: '5px'}} // Added right margin to the checkbox
                          />
                          <span>Insure</span>
                          <br/>
                          <div style={{fontSize: '14px', marginTop: '10px', cursor: 'pointer'}} 
                            onClick={()=>removeReserveItem(product._id, size, type, insuredBoolean, quantity)}>
                            <RiDeleteBin5Line style={{fontSize: '20px'}}/> <h7>Remove</h7>
                          </div>
                          <br/>

                          <div style={{fontSize: '14px', marginTop: '-14px', cursor: 'pointer'}} 
                            onClick={()=>moveToWishlistReserve(product, size, type, insuredBoolean, quantity)}>
                            <CiHeart style={{fontSize: '20px'}}/> <h7>Move to wishlist</h7>
                          </div>
                        </td>
                        <td style={{textAlign: 'center'}}>
                          {(
                            (type === '0' ? product.price * quantity : 
                              type === '1' ? 0.3 * product.price * quantity : 
                              0.4 * product.price * quantity) * 
                            (insuredBoolean ? 1.10 : 1)
                          ).toLocaleString("en-US", { style: "currency", currency: "INR" })}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <div className="insurance-info" style={{ fontSize: '0.8rem', color: '#666' }}>
                            <strong>*Note:</strong> Insuring the items with Rs{( type === '1' ? 0.03 * product.price * quantity : 
                              0.04 * product.price * quantity)} will ensure that if the item is damaged, 
                            Karisme will incur 50% of the cost.
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
                {/* <tfoot>
                    <tr>
                      <td colSpan="3" style={{ backgroundColor: '#F0F0F0', textAlign: 'right', padding: '10px 20px' }}> 
                        <p style={{marginRight: '50px'}}>
                          Subtotal: {totalCombinedPrice()}
                        </p>
                      </td>
                    </tr>
                  </tfoot> */}
              </table>

              <div className="total-price-section" style={{ marginTop: '30px', textAlign: 'right', marginLeft: '130px', marginRight: '137px'}}>
                <h2 style={{ backgroundColor: '#F0F0F0', padding: '10px 20px', borderRadius: '1px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                  border: '1px solid #DDD', fontSize: '18px', marginBottom: '20px'}}>
                  Total Price: <strong>{totalCombinedPrice()}</strong>
                </h2>
              </div>

              
            </div>
          </div>
        </div>
      )}


      </div>
    </Layout>
  );
};

export default CartPage;