import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import TopSlider from '../components/Designs/TopSlider';
import { FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useWish } from '../context/wish';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import HeartIconToggle from "../components/Designs/HeartIconToggle.jsx";
import { GiShoppingCart } from "react-icons/gi";
import { Modal , Button} from 'antd';
import '../styles/SearchBot.css'

const SearchBot = () => {
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState(null); // Initialize to null to indicate no data initially
  const [selectedProductForCart, setSelectedProductForCart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState()
  const [selectedType, setSelectedType] = useState('0')
  const [wish, setWish] = useWish(); 
  const [cart, setCart] = useCart(); 
  const navigate = useNavigate()


  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); 
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

  const handleCartIconClick = async (product) => {
    setIsModalOpen(true);
    setSelectedProductForCart(product);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { text: inputValue };
    console.log(data)
    try {
      const response = await axios.post('/api/v1/product/recommend-products', data);
      setProducts(response?.data?.products || []); // Set to empty array if no products
    //   setInputValue('');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };


  useEffect(() => {
    console.log(inputValue);
  }, [inputValue]);

  const clearInput = () => {
    setInputValue('');
  };

  const sampleQuestions = [
    "What should I wear for a beach party?",
    "Outfit ideas for a winter wedding.",
    "Best casual wear for summer.",
    "Formal attire for a corporate meeting.",
    "Trendy outfits for college students.",
    "Dress code for a garden party.",
    "What to wear on a first date at a fancy restaurant?",
    "Appropriate attire for a job interview in the tech industry.",
    "Comfortable yet stylish outfits for long flights.",
    "Chic ensemble options for a city break."
  ];
  

  const handleQuestionClick = async (question) => {
    const data = { text: question };
    try {
      const response = await axios.post('/api/v1/product/recommend-products', data);
      setProducts(response?.data?.products || []);
      setInputValue(question)
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  if (products) {
    return (
        <Layout>
            <TopSlider items={[
                { id: 1, content: "Free Delivery over Rs 4000" },
                { id: 2, content: "Hassle-free return process" },
                { id: 3, content: "Greater quality, lower price" }
            ]} />
             <div className='second-search-container'>
            {/* "KARISMA" Text */}
            <div className='karisme-text' onClick={() => navigate('/ask')}>
                KARISME
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className='second-search-form'>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="What are you looking for?"
                    className='second-search-input'
                />
                {/* <button className='btn-close close-button' onClick={clearInput}>
                </button> */}
              </form>
            </div>
            {/* <hr/> */}
            <div className="d-flex flex-wrap p-3 product-container">
            {products?.map((p) => (
                <div key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    className="product-image"
                  />
                  <div>
                    <div>
                      <h5 className='product-image-name'>{p.name}</h5>
                      <h5 className='product-image-price'>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      <div className='product-card-like'>
                      <HeartIconToggle
                        isFilled={isProductInWishList(p)}
                        onToggle={() => {
                          if (isProductInWishList(p)) {
                            const newWish = wish.filter((wishProduct) => wishProduct._id !== p._id);
                            setWish(newWish);
                            localStorage.setItem("wish", JSON.stringify(newWish));
                            toast.success('Item removed from wishlist');
                          } else {
                            const newWish = [...wish, p];
                            setWish(newWish);
                            localStorage.setItem("wish", JSON.stringify(newWish));
                            toast.success('Item added to wishlist');
                          }
                        }}
                      />
                      <GiShoppingCart 
                        className='product-card-cart'
                        onClick={() => {
                          handleCartIconClick(p);
                        }}
                      />
                      
                    </div>
                    </div>
                </div>

            </div>
            ))}
            </div>
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
            className='modal-add-to-cart-btn'
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4E362B')} // Darker brown on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5C4033')} // Original brown color
          >
            Add to Cart
          </Button>,
          <Button
            key="close"
            onClick={() => setIsModalOpen(false)}
            className='modal-close-btn'
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#4E362B')} // Darker brown on hover
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#5C4033')} // Original brown color
          >
            X
          </Button>
        ]}
      > 
        <div className='btn-sizes' >
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`modal-size-btn ${selectedSize === size ? 'modal-size-btn-selected' : 'modal-size-btn-not-selected'}`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className='flex-row'>
            {["0", "1", "2"].map((type, index) => {
              const buttonText = [
                { text: "Buy", price: selectedProductForCart?.price },
                { text: "Lease for 3 days", price: Math.round(0.3 * selectedProductForCart?.price / 10) * 10 },
                { text: "Lease for 7 days", price: Math.round(0.4 * selectedProductForCart?.price / 10) * 10 }
              ][index];

              return (
                <button 
                  key={type} 
                  className={`modal-btn-options ${selectedType === type ? 'modal-btn-options-selected' : 'modal-btn-options-not-selected'}`} 
                  onClick={() => setSelectedType(type)}
                >
                  <p>{buttonText.text}</p>
                  <p>Price: {buttonText.price}</p>
                </button>
              );
            })}
          </div>

          <div className='modal-reserve-text'
            onClick={() => navigate(`/product/${selectedProductForCart.slug}`)}>
            <p>Click here to reserve</p>
          </div>
      </Modal>
        </Layout>
    )
  }
  
  return (
    <Layout>
        <div>
            <TopSlider items={[
                { id: 1, content: "Free Delivery over Rs 4000" },
                { id: 2, content: "Hassle-free return process" },
                { id: 3, content: "Greater quality, lower price" }
            ]}/>
        </div>
        
      <div className='search-container-start'>
        <h1 className='karisme-top-text'>KARISME</h1>
        <form onSubmit={handleSubmit} className='top-search-form'>
          <input
            type="text"
            value={inputValue} 
            onChange={handleInputChange}
            placeholder="What are you looking for?"
            className='top-search-bar'
          />
          <div className='btn-options-container'>
            {/* <button className='btn-random-search'>
                Search random
            </button> */}
            {/* <button type="submit" className='btn-search'>
                Search
            </button> */}
          </div>
        </form>
      </div>
        <div className='sample-questions-container'>
            <div className='questions-wrap-1'>
                <div className='questions-extra-div'>
                {sampleQuestions.map((question, index) => (
                      <div key={index} onClick={() => handleQuestionClick(question)} className='question-container'>
                          <span>{question}</span>
                          <FaSearch /> 
                      </div>
                  ))}
                </div>
            </div>
        </div>
    </Layout>
  );  
  
};

export default SearchBot;
