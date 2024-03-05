import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useWish } from "../context/wish";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { GiShoppingCart } from "react-icons/gi";
import StarRating from "../components/Designs/Stars";
import { BsFillHeartbreakFill } from "react-icons/bs";

const WishListPage = () => {
    const [auth, setAuth] = useAuth();
    const [wish, setWish] = useWish();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    const removeWishItem = (pid) => {
        try {
          let myWish = [...wish];
          let index = myWish.findIndex((item) => item._id === pid);
          myWish.splice(index, 1);
          setWish(myWish);
          localStorage.setItem("wish", JSON.stringify(myWish));
        } catch (error) {
          console.log(error);
        }
      };

      const generateWhatsAppShareLink = () => {
        const baseURL = "https://api.whatsapp.com/send?text=";
        const messageIntro = "Check out my wishlist items:%0a%0a"; // %0a is the URL encoded newline character
        const itemsString = wish.map(p => `${p.name}: ${window.location.origin}/product/${p.slug}`).join('%0a');
        return `${baseURL}${messageIntro}${itemsString}`;
      };

      return (
        <Layout>
          <div className="wish-page">
            <div className="row">
              <div className="col-md-12" style={{marginTop: '40px'}}>
                <h1 className="text-center bg-light p-2 mb-1">
                  {/* {!auth?.user
                    ? "Hello Guest"
                    : `Hello  ${auth?.token && auth?.user?.name}`} */}
                  <p className="text-center">
                    {wish?.length
                      ? `Hi ${auth?.token && auth?.user?.name}, here are your liked items ${
                          auth?.token ? "" : "please login to view your wishlist !"
                        }`
                      : " Your wish list Is Empty"}
                  </p>
                </h1>
              </div>
            </div>
        </div>
              
        <div style={{marginLeft: '1000px', marginTop: '-90px', marginBottom: '60px'}}>
          <a href={generateWhatsAppShareLink()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <button style={{marginLeft: '100px', borderRadius: '30px', width: '170px', 
              height: '38px', backgroundColor: 'white', borderWidth: '3px', borderColor: 'green'}}>
              <div style={{flexDirection: 'row'}}>
                Share with friends
              </div>
            </button>
          </a>
        </div>

    <div style={{marginLeft: '200px', marginRight: '200px', marginTop: '-30px'}}>
        <div className="d-flex flex-wrap p-3" style={{marginLeft: '-165px', marginRight: '-350px', padding: '0px'}}>
              {wish?.map((p) => (
                <div key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    style={{height: '350px', width:'270px', cursor:'pointer', marginTop: '10px', padding: '5px'}}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    className="product-image "
                  />
                  <div >
                    <div>
                      <h5  style={{fontSize:'14px', marginBottom: '0px', marginTop: '0px', marginLeft: '8px'}}>{p.name}</h5>
                      <h5 style={{marginBottom: '-5px', fontSize:'16px', marginLeft: '8px', marginTop: '-1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      <div style={{marginLeft: '6px', flexDirection:'row', marginTop: '2px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div>
                      <div style={{fontSize: '25px', marginLeft: '190px', marginTop:'-55px', marginBottom: '16px'}}> 
                      <BsFillHeartbreakFill style={{fontSize: '25px', marginTop: '-10px', cursor: 'pointer',}} 
                        onClick={() => removeWishItem(p._id)}/>
                      <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '-9px' }} 
                        onClick={()=>{
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success('Item added to cart');
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>


        </Layout>

)}

export default WishListPage;