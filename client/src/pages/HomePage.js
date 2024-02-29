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
import guide1 from '../images/guide1.jpeg'
import RightOnlyCarousel from '../components/Designs/RightOnlyCarousal.js';
import Designer from '../components/Content/Designer.js';


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

  const carouselItems = [
    {
      image: backgroundImage,
      content: 'Slide 1 Content',
    },
    {
      image: try2,
      content: 'Slide 1 Content',
    }
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
      <div className='row body'>

      <TopSlider items={topSliderItems} />

      <Carousel autoplay autoplaySpeed={3000}>
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-slide">
              <img src={item.image} alt={`Slide ${index + 1}`} style={{ width: '100%', maxHeight: '60vh', objectFit: 'cover' }} />
            </div>
          ))}
        </Carousel>

        <div className='col-md-9' style={{marginTop:'30px'}}>
          <div style={{marginLeft: '-120px', marginBottom: '-40px'}}> 
            <h1 className='text-center body' style={{fontWeight: 'bold', color: '#3F250B', marginLeft: '500px'}}>
              Our top 10 this week <IoMdTrendingUp style={{ marginLeft: '-10px' }} />
            </h1>
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
                      <h5 style={{marginBottom: '-5px', fontSize:'16px', marginLeft: '8px', marginTop: '1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      <div style={{marginLeft: '6px', flexDirection:'row', marginTop: '4px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div>
                      <div style={{fontSize: '25px', marginLeft: '190px', marginTop:'-55px', marginBottom: '16px'}}>
                        <IoHeartCircle style={{
                          fontSize: '30px',
                          borderWidth: '10px',
                          borderColor: 'black',
                          marginTop: '-10px',
                          cursor: 'pointer',
                          color: isProductInWishList(p) ? '#c20e35' : 'black',
                        }} 
                        onClick={() => {
                          const isInWishList = isProductInWishList(p);
                          if (isInWishList) {
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

                        <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '-9px' }} 
                          onClick={()=>{
                            setCart([...cart, p]);
                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                            toast.success('Item added to cart');
                          }}/>
                      </div>
                    </div>
                  </div>
                </div>
                
              ))}
            </div>  

          {/* <div className='m-2 p-3'>
            {products && products.length < total && (
              <button className='btn' onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}  style={{marginLeft: '600px', height: '40px', borderRadius: '30px', 
                    width: '130px', marginTop: '-17px', backgroundColor: '#f3e5e3'}}>
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div> */}
          {/* <div style={{marginLeft: '30px', marginRight: '-300px'}}>
          <RightOnlyCarousel className='shadow'>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
            <img src={guide1}></img>
          </RightOnlyCarousel>

          </div> */}
          
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
            <Slider2 items={sliderItems2}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '50px', marginBottom: '10px' }}>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} height={'300px'}/>
          </div>
        </div>


        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '-10px' }}>
          <h3 style={{marginLeft: '-760px', marginBottom: '-30px', marginTop: '0px', fontSize: '30px'}}>Celebrity Spotlight</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderCelebrities}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{marginLeft: '-870px', marginBottom: '-30px', marginTop: '30px', fontSize: '30px'}}>Celebrities</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderItems2}/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage;
