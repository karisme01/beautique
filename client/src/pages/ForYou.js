import React, {useState, useEffect, useRef} from 'react'
import Layout from '../components/Layout/Layout'
import RightOnlyCarousel from '../components/Designs/RightOnlyCarousal'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/ForYou.css'
import video from '../videos/video.mp4'
import { useCart } from '../context/cart';
import { useWish } from '../context/wish';
import { GiShoppingCart } from "react-icons/gi";
import { Navigate, useNavigate } from 'react-router-dom'
import { Checkbox, Radio } from 'antd';
import {Colors} from '../components/Filters/Colors.js';
import {Prices} from '../components/Filters/Prices.js';
import {SleeveLength} from '../components/Filters/SleeveLength.js';
import {Sizes} from '../components/Filters/Sizes.js';
import { Materials } from "../components/Filters/Materials.js";
import { Occasions } from "../components/Filters/Occasions.js";
import { BsQuestionCircle } from "react-icons/bs";
import { IoFilter } from "react-icons/io5";
import HeartIconToggle from '../components/Designs/HeartIconToggle.jsx'
import {Modal} from 'antd'


const ForYou = () => {
  const [products, setProducts] = useState();
  const [activeProduct, setActiveProduct] = useState(null);
  const [prevProduct, setPrevProduct] = useState(null);
  const [productLikes, setProductLikes] = useState({});
  const [cart, setCart] = useCart()
  const [wish, setWish] = useWish()
  const productDetailRef = useRef(null);
  const [expand, setExpand] = useState(false)
  const [liked, setLiked] = useState(false) 
  const [showPanel, setShowPanel] = useState(false);
  const [radio, setRadio] = useState([]);
  const [filterColor, setFilterColor] = useState([]);
  const [filterSleeve, setFilterSleeve] = useState([]);
  const [filterSize, setFilterSize] = useState([]);
  const [filterMaterial, setFilterMaterial] = useState([]);
  const [filterOccasion, setFilterOccasion] = useState([]);
  const [filterRent, setFilterRent] = useState(true);
  const [filterCategory, setFilterCategory] = useState([]);
  const [categories, setCategories] = useState([])
  const [selectedSize, setSelectedSize] = useState(""); 
  const [purchaseType, setPurchaseType] = useState('0');
  const [showModal, setShowModal] = useState(false);


  const navigate = useNavigate()

  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handlePurchaseSelection = (type) => {
    setPurchaseType(type);
  };

  const addToCart = (product, selectedSize, selectedType) => {
    const isProductInCart = cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[1] === selectedType
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

  const { token } = JSON.parse(localStorage.getItem("auth")) || {};
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/for-you-products", {
        headers: {
          Authorization: `Bearer ${token}`
        } 
      });
      if (data?.success) {
        setProducts(data?.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting products");
    }
  };

  useEffect(() => {
    if (expand && productDetailRef.current) {
      productDetailRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expand]);

  useEffect(() => {
    if (activeProduct) {
      setPrevProduct(activeProduct);
      if (prevProduct){
        setProductLikes(prev => ({...prev,[prevProduct._id]: liked}));
      }
      console.log(productLikes)
    }
    
  }, [activeProduct]);

  const updatePreferences = async () => {
    try {
      const { data } = await axios.put(`/api/v1/auth/preferences`, {productLikes});
      console.log('hiii')
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const likesCount = Object.keys(productLikes).length;
    if (likesCount === 10) {
      updatePreferences();
      setProductLikes({})
    }
  }, [productLikes]); // This us
  


  useEffect(() => {
    getAllProducts(); 
    getAllCategory();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      setActiveProduct(products[0]);
    }
  }, [products]); 

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  const isProductInCart = (product, selectedSize, selectedType) => {
    return cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
    );
  };
  

  return (
    <div className="for-you-page">
    <Layout>
      <div>

      <div style={{marginTop: '81px', marginBottom: '-78px', marginLeft: '1383px'}}>
          <BsQuestionCircle style={{marginLeft: '-10px', marginRight: '10px', fontSize: '45px', cursor: 'pointer'}} onClick={handleOpenModal}/>
          
      </div>

      <Modal
        title={
          <div style={{ fontSize: '24px', color: '#8B5A42' }}>Discover Your Style</div>
        }
        open={showModal}
        onCancel={handleCloseModal}
        footer={[
          <button onClick={handleCloseModal} style={{
            background: '#8B5A42',
            color: 'white',
            padding: '10px 30px',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}>
            Explore & Enjoy
          </button>
        ]}
        style={{ maxWidth: '600px'}}
        // bodyStyle={{ backgroundColor: '#F5F5DC' }}
      >
        <div style={{fontSize: '16px', lineHeight: '1.5', color: '#555', padding: '20px', backgroundColor: 'cream', borderRadius: '10px', border: '2px solid #D3B8AE'}}>
          <p style={{marginBottom: '8px'}}>Welcome to your personalized clothing recommendation journey!</p>
          <p style={{marginBottom: '15px'}}>As you explore, your interactions will help us tailor suggestions just for you:</p>
          <ul>
            <li style={{marginBottom: '10px'}}>
            <span style={{fontWeight: 'bold'}}>Like</span> what you see? Tap the 
            <span style={{color: 'black', marginLeft: '4px', marginRight: '4px'}}>♥</span>
             to let us know.
            </li>
            <li style={{marginBottom: '10px'}}>
              Not for you? Hit the 
              <span style={{color: '#000', marginLeft: '4px', marginRight: '4px', fontSize: '20px'}}>✖</span>
              to pass.
            </li>
            <li>
              Curious? The 
              <span style={{color: '#000', marginLeft: '4px', marginRight: '4px', fontSize: '20px'}}>↓</span>
              lets you delve into the details.
            </li>
          </ul>
          <p>Your interactions here shape a bespoke experience, sculpting the art of personal style. Let's embark on this style journey together.</p>
        </div>
      </Modal>





    {/* <div className="App" style={{marginTop: '85px', marginBottom: '-85px', marginLeft: '-50px'}}>
      <button style={{marginLeft: '100px', borderRadius: '30px', width: '130px', 
          height: '38px', backgroundColor: 'black', borderWidth: '1px', borderColor: 'white'}} onClick={() => setShowPanel(!showPanel)}>
        <div style={{flexDirection: 'row'}}>
          <IoFilter style={{marginLeft: '-10px', marginRight: '10px'}}/>
          All Filters
        </div>
      </button>

      <div className={`infoPanel ${showPanel ? 'show' : ''}`}>
        <button type="button" class="btn-close" onClick={() => setShowPanel(false)} style={{marginLeft:'360px', marginTop: '20px'}}></button>

        <div className="filter-container mt-5 bg-white" style={{ marginTop: '100px', padding: '20px', 
            borderRadius: '10px',marginLeft: '15px', marginRight: '20px', marginBottom: '-20px', color: 'black',borderColor: '#553c2c' }}>
            <h4 className='text-center' style={{marginLeft: '-260px', fontSize: '18px', fontWeight:'bold'}}>Price</h4>
            <div className='d-flex flex-column' style={{marginLeft: '5px'}}>
              <Radio.Group onChange={e => setRadio(e.target.value)}>
                {Prices?.map(p => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
          </div>


          <div className="filter-container bg-white" style={{ marginTop: '30px', padding: '20px', 
               borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c' }}>
            <h4 className='text-center' style={{marginLeft: '-230px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Category</h4>
            
            <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterCategory(checkedValues)}
              value={filterCategory}
            >
              {categories?.map(c => (
                <div key={c._id} className="mb-1" style={{width: '80%', marginRight: '-20px'}}> 
                  <Checkbox value={c.name}>
                    {c.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>


          <div className="filter-container bg-white" style={{ marginTop: '10px', padding: '20px', 
               borderRadius: '10px',marginLeft: '15px', marginRight: '20px'}}>
            <h4 className='text-center' style={{marginLeft: '-260px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Color</h4>
            
            <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterColor(checkedValues)}
              value={filterColor}
            >
              {Colors?.map(c => (
                <div key={c._id} className="mb-1" style={{width: '40%', marginRight: '-20px'}}>
                  <Checkbox value={c.name}>
                    {c.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>


          <div className="filter-container bg-white" style={{ marginTop: '10px', padding: '20px', 
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c' }}>
            <h4 className='text-center' style={{marginLeft: '-190px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Sleeve Length</h4>
          <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterSleeve(checkedValues)}
              value={filterSleeve}
            >
              {SleeveLength?.map(s => (
                <div key={s._id} className="mb-1" style={{width: '100%', marginRight: '30px'}}> 
                  <Checkbox value={s.name}>
                    {s.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>

          <div className="filter-container bg-white" style={{ marginTop: '10px', padding: '20px', 
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c', marginBottom: '30px' }}>
            <h4 className='text-center' style={{marginLeft: '-260px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Sizes</h4>
          <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterSize(checkedValues)}
              value={filterSize}
            >
              {Sizes?.map(s => (
                <div key={s._id} className="mb-1" style={{width: '30%', marginRight: '30px'}}> 
                  <Checkbox value={s.name}>
                    {s.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>

          <div className="filter-container bg-white" style={{ marginTop: '-20px', padding: '20px', 
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c', marginBottom: '10px' }}>
            <h4 className='text-center' style={{marginLeft: '-240px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Material</h4>
          <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterMaterial(checkedValues)}
              value={filterMaterial}
            >
              {Materials?.map(s => (
                <div key={s._id} className="mb-1" style={{width: '30%', marginRight: '30px'}}> 
                  <Checkbox value={s.name}>
                    {s.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>

          <div className="filter-container bg-white" style={{ marginTop: '0px', padding: '20px', 
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c', marginBottom: '10px' }}>
            <h4 className='text-center' style={{marginLeft: '-230px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Occasion</h4>
          <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
            <Checkbox.Group
              onChange={(checkedValues) => setFilterOccasion(checkedValues)}
              value={filterOccasion}
            >
              {Occasions?.map(s => (
                <div key={s._id} className="mb-1" style={{width: '30%', marginRight: '30px'}}> 
                  <Checkbox value={s.name}>
                    {s.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
          </div>
        
          <div className="filter-container bg-white" style={{ marginTop: '0px', padding: '20px', 
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c', marginBottom: '10px' }}>
            <h4 className='text-center' style={{marginLeft: '-190px', fontSize: '18px', color: 'black', fontWeight:'bold'}}>Purchase Type</h4>
            <Checkbox 
                onChange={(e) => setFilterRent(e.target.checked)}
                value={filterRent}
              >
                One Time Ownership
              </Checkbox>
          </div>

        
      </div>
    </div> */}
        

        <h1 className='text-center' style={{marginTop: '30px', fontWeight: 'bold', letterSpacing: '4px'}}>
          FOR YOU FROM US
        </h1>


        <RightOnlyCarousel 
            onActiveSlideChange={(index) => {
              setActiveProduct(products[index]);
            }}
            onExpandPress={(expand)=>setExpand(expand)}
            onLikePress={(liked) => {
              setLiked(liked);
          }}
          >
          {products?.map((product, index) => (
            <img key={index} 
            src={`/api/v1/product/product-photo/${product?._id}`} 
            alt={`Product ${index}`}
            className='carousel-image'
            style={{cursor: 'pointer'}}
            />
          ))}
        </RightOnlyCarousel>

        

        {/* product detail section */}

        <div className='product-detail' ref={productDetailRef}style={{marginBottom: '50px'}}>
          <div style={{height:'20px'}}></div>
          {activeProduct && expand && (
            <div className='row container' style={{marginTop: '30px', marginLeft: '-100px'}}>
            <div className='col-md-6' style={{marginLeft:'100px', marginRight: '60px'}}>
            <img
                src={`/api/v1/product/product-photo/${activeProduct?._id}`}
                className="card-img-top"
                alt={activeProduct?.name}
                style={{ height: '600px', width: '400px', objectFit: 'cover'}}
              />

              <div classname="text-center" style={{width: '610px', height: '350px', marginTop: '30px', 
                borderWidth: '20px', backgroundColor: '#efefef', marginLeft: '0px'}}>
                <h1 style={{fontSize: '23px', padding: '20px', fontWeight: 'bold'}}>
                Take it on lease and enjoy luxury while saving thousands with easy returns and services.
                </h1>
                <p style={{fontSize: '15px', padding: '25px', marginTop: '-30px', color: 'grey'}}>
                  Experience the luxury of a diverse wardrobe with Karisme Collections' 4-day and 7-day clothing options. 
                  Say goodbye to buyer's remorse. Embrace a movement that champions confidence, ambition, and eco-conscious living. 
                </p>

                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <button style={{marginLeft: '100px', height: '50px', width: '200px', color: 'white', backgroundColor: 'black'}}>
                    Check leasing policy
                  </button>
                  <button style={{marginLeft: '10px', height: '50px', width: '200px', color: 'white', backgroundColor: 'black'}}>
                    Check return policy
                  </button>
                </div>
                  <div style={{fontSize: '15px', marginLeft: '200px'}}>
                    <p style={{marginTop: '20px', textDecoration: 'underline'}}>Reserve event leasing here</p>
                  </div>
              </div>
            </div>
    
            {/* three extra pictures */}
            <div className='col-md-6' style={{marginLeft: '-360px'}}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '500px', marginLeft: '70px'}}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <img
                          src={`/api/v1/product/product-photo/${activeProduct?._id}`}
                          alt="Small Image 1"
                          style={{ height: '295px', width: '200px', marginBottom: '6px', cursor: 'pointer'}}
                          className='product-image'
                      />
                      {/* <img
                          src={`/api/v1/product/product-photo/${product._id}`}
                          alt="Small Image 2"
                          style={{ height: '195px', width: '160px', marginBottom: '6px', cursor: 'pointer' }}
                          className='product-image'
                      /> */}
                      <img
                          src={`/api/v1/product/product-photo/${activeProduct?._id}`}
                          alt="Small Image 3"
                          style={{ height: '295px', width: '200px', marginBottom: '6px', cursor: 'pointer' }}
                          className='product-image'
                      />
                  </div>
              </div>
            </div>
    
    
            <div className='col-md-6' style={{ marginLeft: '730px', marginTop: '-980px' }}>
              {/* video */}
              <div>
                <video width="100%" height="auto" controls style={{ marginBottom: '20px' }}>
                  <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
              </div>
    
              <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <h1>{activeProduct?.name}</h1>
                <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                  <strong>Description:</strong> {activeProduct?.description}
                </p>
                <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                  <strong>Price:</strong> Rs {activeProduct?.price}
                </p>
                <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                  <strong>Occasion:</strong> {activeProduct?.occasion}
                </p>
                <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                  <strong>Category:</strong> {activeProduct?.category?.name}
                </p>
                {/* <GiShoppingCart style={{fontSize: '50px'}} 
                    onClick={()=>{
                      setCart([...cart, product]);
                      toast.success('Item added to cart');
                    }}/> */}

                
          <div className='btn-sizes' style={{marginLeft: '-10px', marginBottom: '20px'}}>
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelection(size)}
                style={{
                  width: '60px',
                  padding: '15px',
                  margin: '10px',
                  borderRadius: '20px',
                  background: selectedSize === size ? '#4A2B2B' : '#fff',
                  color: selectedSize === size ? '#fff' : '#000', 
                  border: '1px solid #000',
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <div className='flex-row' style={{marginBottom: '20px', marginRight: '-60px'}}>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '0' ? '#4A2B2B' : '#fff',
              color: purchaseType === '0' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('0')}>
              <p>Buy</p>
              <p>Price: {activeProduct?.price}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '1' ? '#4A2B2B' : '#fff',
              color: purchaseType === '1' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('1')}>
              <p>Lease for 3 days</p>
              <p>Price: {String(Math.round(0.3*activeProduct?.price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '2' ? '#4A2B2B' : '#fff',
              color: purchaseType === '2' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('2')}>
              <p>Lease for 7 days</p>
              <p>Price: {String(Math.round(0.4*activeProduct?.price / 10) * 10)}</p>
            </button>
          </div>

              <div style={{display: 'flex', flexDirection: 'row'}}>
              <button
              className='btn-cart'
              onClick={() => {
                if (!isProductInCart(activeProduct, selectedSize, purchaseType)) {
                  setCart([...cart, [activeProduct, selectedSize, purchaseType, 0, 1]]);
                  localStorage.setItem("cart", JSON.stringify([...cart, [activeProduct, selectedSize, purchaseType]]));
                  toast.success('Item added to cart');
                }else {
                  const newCart = cart.filter(cartItem => 
                    !(cartItem[0]._id === activeProduct._id && 
                      cartItem[1] === selectedSize && 
                      cartItem[2] === purchaseType));
                  setCart(newCart);
                  localStorage.setItem("cart", JSON.stringify(newCart));
                  toast.success('Item removed from cart');
                }
              }}
              style={{
                padding: '10px 20px', 
                cursor: 'pointer', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',  
                borderWidth: '0.5px', 
                color: 'black', 
                height: '52px', marginTop: '28px',
                backgroundColor: isProductInCart(activeProduct, selectedSize, purchaseType) ? '#FFF5EE	' : 'white' // Change the color based on the item's presence in the cart
              }}
            >
              {isProductInCart(activeProduct, selectedSize, purchaseType) ? 'Added to cart' : 'Add to cart'}
              <GiShoppingCart style={{fontSize: '30px'}}/>
            </button>

              <button
              className='btn-cart'
              onClick={() => {
                const isInWishList = isProductInWishList(activeProduct);
                if (isInWishList) {
                  const newWish = wish.filter((wishProduct) => wishProduct._id !== activeProduct._id);
                  setWish(newWish);
                  localStorage.setItem("wish", JSON.stringify(newWish));
                  toast.success('Item removed from wishlist');
                } else {
                  const newWish = [...wish, activeProduct];
                  setWish(newWish);
                  localStorage.setItem("wish", JSON.stringify(newWish));
                  toast.success('Item added to wishlist');
                }
              }}
              style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',  borderWidth: '0.5px', color: 'black', marginLeft: '20px', 
              backgroundColor: isProductInWishList(activeProduct) ? '#FFF5EE' : 'white', height: '52px', marginTop: '30px'}}
            >
              <div>
                <span style={{ marginRight: '8px' }}>
                  {isProductInWishList(activeProduct) ? 'Added to wishlist' : 'Add to wishlist'}
                </span>
                <span><HeartIconToggle style={{ fontSize: '30px' }}/></span>
              </div>
            </button>

              </div>


              </div>
            </div>
    
          </div>
          )}
      </div>
      {/* <div className='row container' >
        <h6 style={{marginLeft: '25px', fontSize: '28px', marginTop: '20px', marginBottom: '-20px'}}>Similar products</h6>
        {relatedProducts.length < 1 && (<p className="text-center">No Similar Products found</p>)}
        <div className="d-flex flex-wrap p-3" style={{marginLeft: '20px', margin: '5px', width: '2000px'}}>
              {relatedProducts?.map((p) => (
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
                        <IoHeartCircle style={{
                          fontSize: '30px',
                          borderWidth: '10px',
                          borderColor: 'black',
                          marginTop: '-10px',
                          cursor: 'pointer',
                          color: isProductInWishList(p) ? 'red' : 'black',
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
      </div>
                   */}
                  
          </div>
          
    </Layout>
    </div>
  )
}

export default ForYou
