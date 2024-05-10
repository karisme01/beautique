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
import BrandCard from '../components/Designs/BrandCard.js';


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
  const [videoItems, setVideoItems] = useState([]);
  const [brands, setBrands] = useState([]) 
  const [posts, setPosts] = useState([]) 
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

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    const fetchData = async () => {
        if (!isMounted) return; // Do nothing if the component has been unmounted

        try {
            const videoResponse = await axios.get('/api/v1/product/get-videos');
            const brandResponse = await axios.get('/api/v1/brand/get-brand');
            const postsResponse = await axios.get('/api/v1/brand/get-posts');

            if (isMounted) { // Only update state if component is still mounted
                setVideoItems(videoResponse.data);
                setBrands(brandResponse.data.brand);
                setPosts(postsResponse.data);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    if (!posts.length || !brands.length || !videoItems.length) {
        fetchData();
    }

    return () => { isMounted = false }; // Cleanup function to set isMounted false when the component unmounts
}, []); // Empty dependency array ensures this effect only runs once after the initial render

  
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
      setIsCartPressed(false)
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
      <div className='row body' style={{marginLeft: '0px', marginRight: '0px'}}>

      {/* <TopSlider items={topSliderItems}/> */}
      
      {/* <div style={{width: '800px'}}>
        <img src={backgroundImage} style={{objectFit: 'contain', width: '800px'}}/>
      </div> */}
      {/* <div style={{height: '350px'}}></div> */}
      
      {/* <div className='top-poster'>
          <img src={backgroundImage} alt="Background" />
          <h1>Your Heading Text</h1>
      </div> */}

      {/* <div className="top-section" style={{ display: 'flex'}}>
      </div> */}

      <div className='top'>
        <div style={{height: '350px'}}>
          <div className='top-poster-text'>
            <h1 className="brand-name">Relive the brown theme</h1>
            <button className="aesthetic-button">Explore Now</button>
          </div>
        </div>
        <div className='p-4 post-container'>
          <h4 className='trends-text'>Latest trends for you</h4>
          <div className="horizontal-scroll">
            {posts.map(post => (
              <div key={post._id} className="post-card" onClick={() => navigate(`${post.link}`)}>
                {/* <div className='post-text-container-top'>
                  PRODUCT LAUNCH
                </div> */}
                <img src={`/api/v1/brand/get-post-image/${post._id}`} style={{ width: '100%', height: '320px', objectFit: 'cover'}} />
                {/* <p className='text-center'>{post.caption}</p> */}
                <div className='post-text-container-bottom'>
                  AdyStyles
                </div>
              </div>
            ))}
          </div> 
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
              addToCart(selectedProductForCart, selectedSize, selectedType);; 
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
              color: selectedProductForCart?.rent ? (selectedType === '1' ? '#fff' : '#000') : '#666666',
              cursor: selectedProductForCart?.rent ? 'pointer' : 'not-allowed'
              }} onClick={()=>setSelectedType('1')} disabled={!selectedProductForCart?.rent}>
              <p>Lease for 3 days</p>
              <p>Price: {String(Math.round(0.3*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '140px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: selectedType === '2' ? '#42362B' : '#fff',
              color: selectedProductForCart?.rent ? (selectedType === '2' ? '#fff' : '#000') : '#666666',
              cursor: selectedProductForCart?.rent ? 'pointer' : 'not-allowed'
              }} onClick={()=>setSelectedType('2')} disabled={!selectedProductForCart?.rent}>
              <p>Lease for 7 days</p>
              <p>Price: {String(Math.round(0.4*selectedProductForCart?.price / 10) * 10)}</p>
            </button>
            <div style={{marginTop: '15px', marginBottom: '-15px', marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => navigate(`/product/${selectedProductForCart.slug}`)}>
            <p>Click here to reserve</p>
          </div>
          </div>
      </Modal>
      
        <div className="brands-container">
          <h4 className='p-1'>Suggested for you</h4>
            <div className='brand-cards'>
              {brands.map(brand => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
            </div>
        </div>

        <div className='col-md-9' style={{marginTop:'60px'}}>
          <div style={{marginLeft: '-120px', marginBottom: '-40px'}}> 
            <h1 className='text-center body' style={{color: '#3F250B', marginLeft: '500px', fontWeight: 'bold', fontSize: '30px'}}>
              Our top this week <IoMdTrendingUp style={{ marginLeft: '-10px' }} />
            </h1>
            <div className='mt-4'></div>
          </div>
        
          <div className="d-flex flex-wrap p-3" style={{marginLeft: '20px', marginRight: '-350px', padding: '0px'}}>
              {products?.map((p) => (
                <div key={p._id}>
                  <div key={p._id} className="product-image-container m-2">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="product-image"
                      alt={p.name}
                      style={{height: '425px', width:'320px', cursor:'pointer', marginTop: '10px'}}
                      onClick={() => navigate(`/product/${p.slug}`)}
                    />
                    {/* <div className="product-brand">{p.brand.name}</div> */}
                </div>
                  <div >
                    <div>
                      <h5 style={{fontSize:'16px', marginBottom: '5px', marginTop: '5px', 
                        marginLeft: '14px', textTransform: 'uppercase', letterSpacing: '1px'}}>{p.brand?.name}</h5>
                      <h5 style={{fontSize:'14px', marginBottom: '7px', marginTop: '0px', marginLeft: '14px'}}>{p?.name}</h5>
                      <h5 style={{marginBottom: '5px', fontSize:'15px', marginLeft: '14px', marginTop: '-1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      
                      <div style={{fontSize: '25px', marginLeft: '230px', marginTop:'-70px', marginBottom: '26px'}}>
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

                        <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '0px', marginLeft: '10px'}} 
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
        </div>

        <hr />

        {/* new section */}

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '50px', marginBottom: '-10px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} height={'400px'}/>
          </div>
        </div>  
         
        <div>
          <Designer/>
        </div>


        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '140px', marginBottom: '-40px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={videoItems} height={'400px'}/>
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


        {/* <div className='col-md-9' style={{ textAlign: 'center', marginTop: '50px', marginBottom: '10px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} height={'300px'}/>
          </div>
        </div> */}


      </div>
      </div>
    </Layout>
  )
}

export default HomePage;
