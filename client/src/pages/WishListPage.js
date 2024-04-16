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
import { Modal, Button } from "antd";
import '../styles/WishList.css'

const WishListPage = () => {
    const [auth, setAuth] = useAuth();
    const [wish, setWish] = useWish();
    const [cart, setCart] = useCart();
    const [selectedSize, setSelectedSize] = useState(""); 
    const [selectedType, setSelectedType] = useState('0')
    const [selectedProductForCart, setSelectedProductForCart] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
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

      const handleCartIconClick = (product) => {
        setIsModalOpen(true);
        setSelectedProductForCart(product); // Set the selected product
      };
      const addToCart = (product, selectedSize, selectedType) => {
        if (!selectedSize || selectedType == undefined) {
          toast.error('Please select both a size and a type.');
          return; 
        }
        const isProductInCart = cart.some(cartItem => 
          cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
        );
        if (isProductInCart) {
          toast.error('Item with the selected size is already in your cart');
        } else {
          const newCartItem = [product, selectedSize, selectedType, 0, 1]; 
          setCart([...cart, newCartItem]);
          localStorage.setItem("cart", JSON.stringify([...cart, newCartItem]));
          toast.success('Item added to cart');
        }
      };
    

      const generateWhatsAppShareLink = () => {
        if (wish.length === 0) {
          toast.error('The wishlish is empty. Find something to like to share with friends')
          return
        }
        const baseURL = "https://api.whatsapp.com/send?text=";
        const messageIntro = "Check out my wishlist items:%0a%0a"; // %0a is the URL encoded newline character
        const itemsString = wish.map(p => `${p.name}: ${window.location.origin}/product/${p.slug}`).join('%0a');
        return `${baseURL}${messageIntro}${itemsString}`;
      };

      return (
        <Layout>
          <Modal
        title="Selected Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="add"
            onClick={() => {
              addToCart(selectedProductForCart, selectedSize, selectedType);
              setIsModalOpen(false); 
            }}
            style={{ 
              width: 'auto', 
              marginRight: '10px', 
              fontSize: '17px', 
              borderRadius: '7px', 
              height: '40px', // Increased height
              backgroundColor: '#8B4513', // Brown color
              color: 'white', 
              border: 'none', 
              fontWeight: 'bold',
              boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2)', // Added shadow
              transition: 'background-color 0.3s', // Smooth transition for hover effect
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4E362B')} // Darker brown on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5C4033')} // Original brown color
          >
            Add to Cart
          </Button>,
          <Button
            key="close"
            onClick={() => setIsModalOpen(false)}
            style={{ 
              width: '40px', 
              marginRight: '10px', 
              fontSize: '17px', 
              borderRadius: '7px', 
              height: '40px', // Increased height
              backgroundColor: 'white', 
              color: '#8B4513', // Brown text color
              borderWidth: '1px',
              borderColor: '#8B4513', // Brown border
              transition: 'border-color 0.3s', // Smooth transition for hover effect
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#4E362B')} // Darker brown on hover
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#5C4033')} // Original brown color
          >
            X
          </Button>
        ]}
      > 
        <div className='btn-sizes' style={{marginLeft: '-10px', marginBottom: '20px'}}>
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: '60px',
                  padding: '15px',
                  margin: '10px',
                  borderRadius: '20px',
                  background: selectedSize === size ? '#4E362B' : '#fff',
                  color: selectedSize === size ? '#fff' : '#000',
                  border: '1px solid #000',
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        <div className='flex-row' style={{marginBottom: '-25px', marginRight: '-60px'}}>
            <button className='btn-options' style={{width: '140px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: selectedType === '0' ? '#4E362B' : '#fff',
              color: selectedType === '0' ? '#fff' : '#000',
              }} onClick={()=>setSelectedType('0')}>
              <p>Buy</p>
              <p>Price: {selectedProductForCart?.price}</p>
            </button>
            <button className='btn-options' style={{width: '140px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: selectedType === '1' ? '#4E362B' : '#fff',
              color: selectedType === '1' ? '#fff' : '#000',
              }} onClick={()=>setSelectedType('1')}>
              <p>Half-weekly cycle</p>
              <p>Price: {String(Math.round(0.3*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '140px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: selectedType === '2' ? '#4E362B' : '#fff',
              color: selectedType === '2' ? '#fff' : '#000',
              }} onClick={()=>setSelectedType('2')}>
              <p>Full-weekly cycle</p>
              <p>Price: {String(Math.round(0.4*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
          </div>
          
          <div style={{marginTop: '35px', marginBottom: '-35px', marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => navigate(`/product/${selectedProductForCart.slug}`)}>
            <p>Click here to reserve</p>
          </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: '20px', 
          padding: '20px', 
        }}>
        </div>
      </Modal>

      
          <div className="wish-page">
            <div className="row">
              <div className="col-md-12" style={{marginTop: '0px'}}>
                <h1 className="text-center bg-light p-2 mb-1">
                  Hello {auth?.token && auth?.user?.name}, 
                  <p className="text-center" style={{fontSize: '18px'}}>
                    {wish?.length
                      ? `here are your liked items ${
                          auth?.token ? "" : "please login to view your wishlist !"
                        }`
                      : " Your wish list Is empty"}
                  </p>
                </h1>
              </div>
            </div>
        </div>
              
        <div style={{marginLeft: '1100px', marginTop: '-75px', marginBottom: '80px'}}>
          <button
            style={{marginLeft: '100px', borderRadius: '30px', width: '170px', 
                    height: '38px', backgroundColor: 'white', borderWidth: '3px', borderColor: 'black'}}
            onClick={(e) => {
              e.preventDefault();
              const whatsappLink = generateWhatsAppShareLink();
              if (whatsappLink) {
                window.open(whatsappLink, '_blank');
              }
            }}
          >
            <div style={{flexDirection: 'row'}}>
              Share with friends
            </div>
          </button>
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
                      {/* <div style={{marginLeft: '6px', flexDirection:'row', marginTop: '2px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div> */}
                      <div style={{fontSize: '25px', marginLeft: '190px', marginTop:'-37px', marginBottom: '16px'}}> 
                      <BsFillHeartbreakFill style={{fontSize: '25px', marginTop: '-10px', cursor: 'pointer',}} 
                        onClick={() => removeWishItem(p._id)}/>
                      <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '-9px' }} 
                        onClick={() => {
                          handleCartIconClick(p)
                          setSelectedProductForCart(p)
                          }}
                        />
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