import React, {useState} from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate}  from "react-router-dom";
import TopSlider from "../components/Designs/TopSlider";
import StarRating from "../components/Designs/Stars.js";
import { IoHeartCircle } from "react-icons/io5";
import { GiShoppingCart, GiTruce } from "react-icons/gi";
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
import Codal from "../components/Designs/Codal.js";
import HeartIconToggle from "../components/Designs/HeartIconToggle.jsx";

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [wish, setWish] = useWish();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [radio, setRadio] = useState([]);
  const [filterColor, setFilterColor] = useState([]);
  const [filterSleeve, setFilterSleeve] = useState([]);
  const [filterSize, setFilterSize] = useState([]);
  const [filterMaterial, setFilterMaterial] = useState([]);
  const [filterOccasion, setFilterOccasion] = useState([]); 
  const [filterRent, setFilterRent] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState()
  const [selectedType, setSelectedType] = useState(0)
  const [selectedProductForCart, setSelectedProductForCart] = useState(null);

  const addToCart = (product, selectedSize, selectedType) => {
    if (!selectedSize || !selectedType) {
      toast.error('Please select both a size and a type.');
      return; 
    }
    const isProductInCart = cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
    );
    if (isProductInCart) {
      toast.error('Item with the selected size is already in your cart');
    } else {
      const newCartItem = [product, selectedSize, selectedType]; 
      setCart([...cart, newCartItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newCartItem]));
      toast.success('Item added to cart');
    }
  };

  const handleCartIconClick = (product) => {
    setIsModalOpen(true);
    setSelectedProductForCart(product); // Set the selected product
  };

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  return (
    <Layout title={"Search results"}>
      <TopSlider items={[
          { id: 1, content: "Free Delivery over Rs 4000" },
          { id: 2, content: "Hassle-free return process" },
          { id: 3, content: "Greater quality, lower price" }
        ]} />
      <div className="container">
        <div className="" style={{marginTop: '20px'}}>
          <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          </div>
          <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap p-3" style={{marginLeft: '-165px', marginRight: '-350px', padding: '0px'}}>
              {values.results?.map((p) => (
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
                      <div style={{marginLeft: '10px'}}>
                      <h5  style={{fontSize:'14px', marginBottom: '0px', marginTop: '0px', marginLeft: ''}}>{p.name}</h5>
                      <h5 style={{marginBottom: '-5px', fontSize:'16px', marginLeft: '', marginTop: '-1px'}}>
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      <div style={{marginLeft: '', flexDirection:'row', marginTop: '2px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div>
                      </div>
                      <div style={{fontSize: '25px', marginLeft: '190px', marginTop:'-60px', marginBottom: '16px'}}>
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
                              <option value={0}>Buy</option>
                              <option value={1}>4-day rental</option>
                              <option value={2}>7-day rental</option>
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
        </div>
      </div>
    </Layout>
  );
};

export default Search;
