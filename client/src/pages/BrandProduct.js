import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox } from 'antd';
import axios from "axios";
import StarRating from "../components/Designs/Stars.js";
import { IoHeartCircle } from "react-icons/io5";
import { GiShoppingCart } from "react-icons/gi";
import { useCart } from '../context/cart.js';
import { useWish } from "../context/wish.js";
import { IoFilter } from "react-icons/io5";
import toast from "react-hot-toast";
import "../styles/CategoryProductStyles.css";
import {Colors} from '../components/Filters/Colors.js';
import {Prices} from '../components/Filters/Prices.js';
import {SleeveLength} from '../components/Filters/SleeveLength.js';
import {Sizes} from '../components/Filters/Sizes.js';
import { Materials } from "../components/Filters/Materials.js";
import { Occasions } from "../components/Filters/Occasions.js";
import TopSlider from "../components/Designs/TopSlider.js";
import HeartIconToggle from "../components/Designs/HeartIconToggle.jsx";



const BrandProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState();
  const [cart, setCart] = useCart();
  const [wish, setWish] = useWish();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [filterColor, setFilterColor] = useState([]);
  const [filterPrice, setFilterPrice] = useState([]);
  const [filterSleeve, setFilterSleeve] = useState([]);
  const [filterSize, setFilterSize] = useState([]);
  const [filterMaterial, setFilterMaterial] = useState([]);
  const [filterOccasion, setFilterOccasion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState()
  const [selectedType, setSelectedType] = useState('0')
  const [selectedProductForCart, setSelectedProductForCart] = useState(null);

  const handleCartIconClick = (product) => {
    setIsModalOpen(true);
    setSelectedProductForCart(product); // Set the selected product
  };

  const addToCart = (product, selectedSize, selectedType) => {
    if (!selectedSize || !selectedType) {
      toast.error('Please select both a size and a type.');
      return; 
    }
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

  useEffect(() => {
    if ((filterPrice.length>0 || filterColor.length > 0|| filterSleeve.length > 0|| filterSize.length > 0 || 
        filterMaterial.length>0 || filterOccasion.length>0)) {
      filterBrandProduct();
    } else {
      if (params?.slug) {
        console.log('no filters now')
        setPage(1)
        getProductsByBrand();
      }
    }
  }, [filterColor.length, filterPrice.length, filterSleeve.length, filterSize.length, filterMaterial.length, filterOccasion.length, params?.slug]);
  
  const getProductsByBrand = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-brand/${params.slug}/${page}`);
      setProducts(data?.products);
      setBrand(data?.brand);
    } catch (error) {
      console.log(error);
    }
  };

  const filterBrandProduct = async () => {
    try {
      const { data } = await axios.post('/api/v1/product/product-brand-filters', 
        {brand, filterPrice, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion})
      setProducts(data?.products);
      console.log(products)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-brand/${params.slug}/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  return (
    <Layout>
      <TopSlider items={[
    { id: 1, content: "Free Delivery over Rs 4000" },
    { id: 2, content: "Hassle-free return process" },
    { id: 3, content: "Greater quality, lower price" }
  ]} />

<div style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}>
  {brand && (
    <div>
      <img
        src={`/api/v1/brand/brand-photo/${brand._id}`}
        alt={brand.name}
        style={{ width: '100%', maxHeight: '40vh', objectFit: 'cover' }}
      />
      <div style={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',color: 'white',textAlign: 'center',zIndex: 2,
        }}>
        <h1 style={{ fontSize: '4.5em', fontWeight: 'bold', marginBottom: '0.2em' }}>
          {brand.name}
        </h1>
        <p style={{ fontSize: '1.4em', marginBottom: '0.2em' }}>
          {brand.description || 'Discover the unique fashion and trends.'}
        </p>
        <p style={{ fontSize: '1.4em' }}>
          {brand.phone || 'Discover the unique fashion and trends.'}
        </p>
      </div>
      <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', // Adjust opacity as needed
        }}
      ></div>
    </div>
  )}
</div>


      <div className="container category mt-3">
    {/* filter infoPanel */}
    <div className="App" style={{marginTop: '45px', marginBottom: '-85px', marginLeft: '-50px'}}>
      <button style={{marginLeft: '20px', borderRadius: '30px', width: '130px', 
          height: '38px', backgroundColor: 'white', borderWidth: '3px', borderColor: 'black', marginBottom: '70px'}} onClick={() => setShowPanel(!showPanel)}>
        <div style={{flexDirection: 'row'}}>
          <IoFilter style={{marginLeft: '-10px', marginRight: '10px'}}/>
          All Filters
        </div>
      </button>

      <div className={`infoPanel ${showPanel ? 'show' : ''}`}>
        <button type="button" class="btn-close" onClick={() => setShowPanel(false)} style={{marginLeft:'360px', marginTop: '20px'}}></button>

        <div className="filter-container mt-5 bg-white" style={{ marginTop: '100px', padding: '20px', 
            borderRadius: '10px',marginLeft: '15px', marginRight: '20px', marginBottom: '-20px', borderColor: '#553c2c' }}>
            <h4 className='text-center' style={{marginLeft: '-190px', fontSize: '18px', fontWeight:'bold'}}>Price</h4>
            <div className='d-flex flex-column align-items-start' style={{marginLeft: '5px'}}>
              <Checkbox.Group
                onChange={(checkedValues) => setFilterPrice(checkedValues)}
                value={filterPrice}
              >
                {Prices?.map(s => (
                  <div key={s._id} className="mb-1" style={{width: '100%', marginRight: '30px'}}> {/* Add a margin-bottom for spacing and width control */}
                    <Checkbox value={s.array}>
                      {s.name}
                    </Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </div>
          </div>
          <div className="filter-container bg-white" style={{ marginTop: '30px', padding: '20px', 
               borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c' }}>
            <h4 className='text-center' style={{marginLeft: '-190px', fontSize: '18px', fontWeight:'bold'}}>Color</h4>
            
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
            <h4 className='text-center' style={{marginLeft: '-120px', fontSize: '18px', fontWeight:'bold'}}>Sleeve Length</h4>
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
            <h4 className='text-center' style={{marginLeft: '-200px', fontSize: '18px', fontWeight:'bold'}}>Sizes</h4>
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
            <h4 className='text-center' style={{marginLeft: '-180px', fontSize: '18px', fontWeight:'bold'}}>Material</h4>
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
          borderRadius: '10px',marginLeft: '15px', marginRight: '20px', borderColor: '#553c2c', marginBottom: '0px' }}>
            <h4 className='text-center' style={{marginLeft: '-160px', fontSize: '18px', fontWeight:'bold'}}>Occasion</h4>
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

      </div>
    </div>
        
    
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap p-3" style={{marginLeft: '-165px', marginRight: '-350px', padding: '0px'}}>
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
                      <h5 style={{marginBottom: '-5px', fontSize:'16px', marginLeft: '8px', marginTop: '-1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      {/* <div style={{marginLeft: '6px', flexDirection:'row', marginTop: '2px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div> */}
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
                            setSelectedProductForCart(p._id)
                            }}
                            />
                          {isModalOpen && p._id === selectedProductForCart && (
                            <div className="dropdown-container" style={{marginLeft: '-180px', marginTop: '20px', marginBottom: '-20px'}}>
                              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} 
                                style={{width: '55px', marginRight: '10px', fontSize: '17px', height: '30px'}}>
                              <option value="">Size</option>
                              <option value="XS">XS</option>
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                              </select>
                              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} 
                                style={{width: '60px', marginRight: '10px', fontSize: '17px', height: '30px'}}>
                                <option value="">Type</option>
                                <option value={'0'}>Buy</option>
                                <option value={'1'}>4-day rental</option>
                                <option value={'2'}>7-day rental</option>
                              </select>
                              <button className="add-btn" onClick={() => addToCart(p, selectedSize, selectedType)} 
                                  style={{width: '55px', marginRight: '10px', fontSize: '17px', borderRadius: '5px', 
                                    height: '30px', backgroundColor: 'white', borderWidth: '1px'}}>Add</button>
                              <button className="close-btn" onClick={() => setIsModalOpen(false)}
                                style={{width: '40px', marginRight: '10px', fontSize: '17px', borderRadius: '5px', 
                                    height: '30px', backgroundColor: 'white', borderWidth: '1px'}}>X</button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                
              ))}
            </div>
          </div>
        </div>

        {/* Load more button */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginTop: '20px'}}>
          <div style={{flexGrow: 1, height: '2px', backgroundColor: '#553c2c', margin: '0 20px'}}></div>
          <button 
            style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', backgroundColor: '#ebe8de', borderWidth: '0.5px'}}
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}>
            <div style={{}}>
              More results  
            </div>
          </button>
          <div style={{flexGrow: 1, height: '2px', backgroundColor: '#553c2c', margin: '0 20px'}}></div>
        </div>
      </div>
    </Layout>
  );
};

export default BrandProduct;
