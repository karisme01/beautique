import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartPage.css";
import StarRating from "../components/Designs/Stars";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    return cart.reduce((total, [product, size, selectedType]) => {
      let priceToAdd = product.price;
      if (selectedType === '1') {
        priceToAdd = 0.3 * product.price; 
      } else if (selectedType === '2') {
        priceToAdd = 0.4 * product.price;   
      }
      return total + priceToAdd;
    }, 0).toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };
  

  // Remove item from cart
  const removeCartItem = (pid, sizeToRemove, typeToRemove) => {
    const updatedCart = cart.filter(([product, size, selectedType]) => {
        return !(product._id === pid && size === sizeToRemove && selectedType === typeToRemove);
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
};


  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
              <p className="text-center">
                {cart.length ? `You Have ${cart.length} items in your cart` : "Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="list-container" style={{ marginLeft: '50px', marginRight: '40px' }}>
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              <div className="row">
                {cart.map(([product, size, type], index) => (
                  <div key={index} className="col-md-4 card" style={{ cursor: 'pointer' }}>
                    <div className="product-container">
                      <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        alt={product.name}
                        style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />
                      <div>
                        <h5 style={{ fontSize: '14px', marginTop: '10px', marginBottom: '15px'}}>{product.name}</h5>
                        <h5 style={{ fontSize: '16px', marginTop: '-5px', marginBottom: '10px'}}>
                          Retail Price: {product.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                        </h5>
                        <h5 style={{fontSize: '16px', marginBottom: '10px'}}>
                          Purchase Type: {
                          (type === '0' ? 'Buy' : type === '1' ? '4 day lease' : '7 day lease')
                          .toLocaleString("en-US", { style: "currency", currency: "INR" })
                          }
                        </h5>
                        <h5 style={{fontSize: '16px'}}>
                          Purchase Price: {
                          (type === 0 ? product.price : type === 1 ? 0.3 * product.price : 0.4 * product.price)
                          .toLocaleString("en-US", { style: "currency", currency: "INR" })
                          }
                        </h5>
                        <StarRating rating={product.rating || 3} />
                        <div style={{ fontSize: '25px', marginTop: '-150px', marginLeft: '220px' }}>
                         <MdOutlineRemoveShoppingCart
                            style={{ fontSize: '25px', cursor: 'pointer' }}
                            onClick={() => removeCartItem(product._id, size, type)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-5 cart-summary text-center">
              <h2>Cart Summary</h2>
              <hr />
              <h4>Total: {totalPrice()}</h4>
              {auth.user?.address && (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth.user.address}</h5>
                  <button className="btn btn-outline-dark" onClick={() => navigate("/dashboard/user/profile")}>
                    Update Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
