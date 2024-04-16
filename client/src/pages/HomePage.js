import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.js';
import { useWish } from '../context/wish.js';
import toast from 'react-hot-toast';
import "../styles/Homepage.css";
import { IoMdTrendingUp } from "react-icons/io";
import { IoHeartCircle } from "react-icons/io5";
import { GiShoppingCart } from "react-icons/gi";
import StarRating from "../components/Designs/Stars.js";
import backgroundImage from '../images/temp2.jpeg';
import Slider1 from '../components/Designs/Slider1.js';
import Slider2 from '../components/Designs/Slider2.js';
import TopSlider from '../components/Designs/TopSlider.js';
import try2 from '../images/try2.jpeg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from 'antd';
import {sliderItems1} from '../components/Content/SliderItem1.js'
import {sliderItems2} from '../components/Content/SliderItem2.js'
import {sliderCelebrities} from '../components/Content/SliderCelebrities.js'
import {Modal, Button} from 'antd';
import Designer from '../components/Content/Designer.js';
import HeartIconToggle from '../components/Designs/HeartIconToggle.jsx';


const HomePage = () => {
  const navigate = useNavigate(); 
  const [cart, setCart] = useCart();
  const [wish, setWish] = useWish();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCartPressed, setIsCartPressed] = useState(false)
  const [selectedSize, setSelectedSize] = useState()
  const [selectedType, setSelectedType] = useState()
  const [selectedProductForCart, setSelectedProductForCart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handlePhotoChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      photo: e.target.files[0],
    }));
  };
  
  const handleCartIconClick = (product) => {
    setIsCartPressed(true);
    setSelectedProductForCart(product); // Set the selected product
  };


  const handleSlideClick = (slide, index, itemsArray) => {
    setSelectedSlide(slide);
    setCurrentSlideIndex(index);
    setCurrentItems(itemsArray);
    setIsModalOpen(true);
  };


  const addToCart = (product, selectedSize, selectedType) => {
    if (!selectedSize || !selectedType) {
      toast.error('Please select both a size and a type.');
      return; 
    }
    const isProductInCart = cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
    );
    if (isProductInCart) {
      toast.error('Item with the selected size and purchase type is already in your cart');
    } else {
      const newCartItem = [product, selectedSize, selectedType, 0, 1]; 
      setCart([...cart, newCartItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newCartItem]));
      toast.success('Item added to cart');
    }
  };

  const goToNextSlide = () => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < currentItems.length) { 
      setSelectedSlide(currentItems[nextIndex]);
      setCurrentSlideIndex(nextIndex);
    } else {
      setSelectedSlide(currentItems[0]);
      setCurrentSlideIndex(0);
    }
  };
  
  const goToPrevSlide = () => {
    const prevIndex = currentSlideIndex - 1;
    if (prevIndex >= 0) {
      setSelectedSlide(currentItems[prevIndex]);
      setCurrentSlideIndex(prevIndex);
    } else {
      setSelectedSlide(currentItems[currentItems.length - 1]);
      setCurrentSlideIndex(currentItems.length - 1);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  const carouselItems = [
    {
      image: backgroundImage,
      content: 'Slide 1 Content',
    },
    // {
    //   image: try2,
    //   content: 'Slide 1 Content',
    // }
  ];
  
  const topSliderItems = [
    { id: 1, content: "Free Delivery over Rs 4000" },
    { id: 2, content: "Hassle-free return process" },
    { id: 3, content: "Greater quality, lower price" },
    { id: 4, content: "Flat sale - COUPON CODE: A82HD2" }
  ];
  

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count')
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio])

  const filterProduct = async () => {
    try {
      const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio })
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Layout title={'Karisme'}>
      <div className={`row body ${isModalOpen ? 'blur-effect' : ''}`}>
      <div className='row body' style={{marginLeft: '7px'}}>

      <TopSlider items={topSliderItems}/>

      <div className="top-section" style={{ display: 'flex', marginTop: '20px', marginBottom: '20px', gap: '10px' }}>
        <div style={{ flex: 7 }}>
          <img src={backgroundImage} alt="Background" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5ebe7', borderRadius: '8px', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '20px'}}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ textAlign: 'center', margin: '0', fontSize: '24px', fontWeight: 'bold' }}>Apply to participate in 'Outfit of the Week' contest</h2>
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
              <label htmlFor="name" style={{ marginBottom: '5px' }}>Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
              <label htmlFor="phoneNumber" style={{ marginBottom: '5px' }}>Phone Number</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
              <label htmlFor="photoUpload" style={{ marginBottom: '5px' }}>Upload Photo</label>
              <input type="file" id="photoUpload" onChange={handlePhotoChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', cursor: 'pointer' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', 
              backgroundColor: '#000', color: 'white', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Apply
            </button>
          </form>
        </div>
      </div>

      <Modal
        title="Selected Product"
        open={isCartPressed}
        onCancel={() => setIsCartPressed(false)}
        footer={[
          <Button
            key="add"
            onClick={() => {
              addToCart(selectedProductForCart, selectedSize, selectedType);
              setIsCartPressed(false); 
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
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4E362B')} // Original brown color
          >
            Add to Cart
          </Button>,
          <Button
            key="close"
            onClick={() => setIsCartPressed(false)}
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
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#4E362B')} // Original brown color
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
        <div className='flex-row' style={{marginBottom: '25px', marginRight: '-60px'}}>
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
              <p>Lease for 3 days</p>
              <p>Price: {String(Math.round(0.3*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '140px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: selectedType === '2' ? '#4E362B' : '#fff',
              color: selectedType === '2' ? '#fff' : '#000',
              }} onClick={()=>setSelectedType('2')}>
              <p>Lease for 7 days</p>
              <p>Price: {String(Math.round(0.4*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
            <div style={{marginTop: '15px', marginBottom: '-15px', marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => navigate(`/product/${selectedProductForCart.slug}`)}>
            <p>Click here to reserve</p>
          </div>
          </div>
      </Modal>



        <div className='col-md-9' style={{marginTop:'30px'}}>
          <div style={{marginLeft: '-120px', marginBottom: '-40px'}}> 
            <h1 className='text-center body' style={{color: '#3F250B', marginLeft: '500px', fontWeight: 'bold', fontSize: '30px'}}>
              Our top 10 this week <IoMdTrendingUp style={{ marginLeft: '-10px' }} />
            </h1>
            <div className='mt-4'></div>
          </div>
        
          <div className="d-flex flex-wrap p-3" style={{marginLeft: '20px', marginRight: '-350px', padding: '0px'}}>
              {products?.map((p) => (
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
                      <h5 style={{marginBottom: '-5px', fontSize:'14px', marginLeft: '8px', marginTop: '1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      
                      <div style={{fontSize: '25px', marginLeft: '190px', marginTop:'-40px', marginBottom: '16px'}}>
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
                          }}/>

                        <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '0px' }} 
                          onClick={() => {
                            handleCartIconClick(p)
                            }}
                            />
                      </div>
                    </div>
                  </div>
                </div>
                
              ))}
            </div>  
            
          
          {/* line for designers */}
          
          <Designer/>
        </div>



        {/* </div> */}
        <div style={{height:'50px'}}></div>

        {/* new section */}
        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '100px', marginBottom: '-40px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} height={'400px'}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
        <h3 style={{marginLeft: '-920px', marginBottom: '-30px', marginTop: '40px', fontSize: '30px'}}>Guides</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderItems2} onSlideClick={(slide, index) => handleSlideClick(slide, index, sliderItems2)}/>
          </div>
        </div>

        <Modal 
          title="Slide Detail" 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          centered
          footer={[
            <Button key="find">
              Find like this
            </Button>,
          ]}
        >
          <div>
            <h2>{selectedSlide?.title}</h2>
            <img style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
            src={selectedSlide?.image}/>
            <h5>{selectedSlide?.content}</h5>
          </div>
        </Modal>


        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '50px', marginBottom: '10px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} height={'300px'}/>
          </div>
        </div>


        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '-10px' }}>
          <h3 style={{marginLeft: '-760px', marginBottom: '-30px', marginTop: '0px', fontSize: '30px'}}>Celebrity Spotlight</h3>
          <div className='' style={{marginRight: '-300px'}}>
          <Slider2 items={sliderCelebrities} onSlideClick={(slide, index) => handleSlideClick(slide, index, sliderCelebrities)}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{marginLeft: '-870px', marginBottom: '-30px', marginTop: '30px', fontSize: '30px'}}>Celebrities</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderItems2} onSlideClick={(slide, index) => handleSlideClick(slide, index, sliderItems2)}/>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default HomePage;
