import Layout from '../components/Layout/Layout';
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useWish } from '../context/wish';
import StarRating from "../components/Designs/Stars"
import { IoHeartCircle } from "react-icons/io5";
import { GiShoppingCart } from "react-icons/gi";
import video from '../videos/video.mp4'
import '../styles/ProductDetails.css'


import toast from 'react-hot-toast';
import TopSlider from '../components/Designs/TopSlider';
import HeartIconToggle from '../components/Designs/HeartIconToggle';

const ProductDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [cart, setCart] = useCart()
  const [relatedProducts, setRelatedProducts] = useState([])
  const [wish, setWish] = useWish();
  const [selectedSize, setSelectedSize] = useState(""); 
  const [price, setPrice] = useState()
  const [image, setImage] = useState()
  const [purchaseType, setPurchaseType] = useState(0);

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //getProduct 
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      if (data?.product) {
        setProduct(data.product);
        setPrice(parseInt(data.product.price, 10)); // Moved price setting here to ensure it's set alongside product
        getSimilarProduct(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePurchaseSelection = (type) => {
    setPurchaseType(type);
  };

  

  const topSliderItems = [
    { id: 1, content: "Free Delivery over Rs 4000" },
    { id: 2, content: "Hassle-free return process" },
    { id: 3, content: "Greater quality, lower price" },
    { id: 4, content: "Flat sale - COUPON CODE: A82HD2" }
  ];

  //similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-products/${pid}/${cid}`);
      setRelatedProducts(data?.products);
      console.log(relatedProducts)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  if (!product._id) {
    return <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        The product is loading....
        </div>
        </Layout>;
  }


  return (
    <Layout>
      <TopSlider items={topSliderItems}/>
      <div className='row container' style={{marginTop: '30px', marginLeft: '-100px'}}>
        <div className='col-md-6' style={{marginLeft:'100px', marginRight: '60px'}}>
        <img
            src={`/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top"
            alt={product?.name}
            style={{ height: '600px', width: '400px', objectFit: 'cover', cursor: 'pointer'}}
          />
        </div>

        {/* three extra pictures */}
        <div className='extra col-md-6' style={{marginLeft: '-360px', overflowY: 'scroll', 
            height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px'}}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '500px', marginLeft: '70px'}}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img
                      src={`/api/v1/product/product-photo/${product?._id}`}
                      alt="Small Image 1"
                      style={{ height: '285px', width: '200px', marginBottom: '6px', cursor: 'pointer'}}
                      className='product-image'
                  />
                  <img
                      src={`/api/v1/product/product-photo/${product?._id}`}
                      alt="Small Image 3"
                      style={{ height: '285px', width: '200px', marginBottom: '6px', cursor: 'pointer' }}
                      className='product-image'
                  />
                  <img
                      src={`/api/v1/product/product-photo/${product?._id}`}
                      alt="Small Image 3"
                      style={{ height: '285px', width: '200px', marginBottom: '6px', cursor: 'pointer' }}
                      className='product-image'
                  />
              </div>
          </div>
        </div>


        <div className='col-md-6' style={{ marginLeft: '730px', marginTop: '-600px' }}>
          {/* video */}
          <div>
            <video width="100%" height="auto" controls style={{ marginBottom: '20px' }}>
              <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
          </div>

          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <h1>{product?.name}</h1>
            <p style={{ marginBottom: '10px', fontSize: '16px' }}>
              <strong>Description:</strong> {product?.description}
            </p>
            <p style={{ marginBottom: '10px', fontSize: '16px' }}>
              <strong>Price:</strong> Rs {product?.price}
            </p>
            <p style={{ marginBottom: '10px', fontSize: '16px' }}>
              <strong>Occasion:</strong> {product?.occasion}
            </p>
            <p style={{ marginBottom: '10px', fontSize: '16px' }}>
              <strong>Category:</strong> {product?.category?.name}
            </p>

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
                  background: selectedSize === size ? '#332211' : '#fff',
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
              background: purchaseType === 0 ? '#332211' : '#fff',
              color: purchaseType === 0 ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection(0)}>
              <p>Buy</p>
              <p>Price: {product?.price}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === 1 ? '#332211' : '#fff',
              color: purchaseType === 1 ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection(1)}>
              <p>Lease for 3 days</p>
              <p>Price: {String(Math.round(0.3*price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === 2 ? '#332211' : '#fff',
              color: purchaseType === 2 ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection(2)}>
              <p>Lease for 7 days</p>
              <p>Price: {String(Math.round(0.4*price / 10) * 10)}</p>
            </button>
          </div>
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <button
              className='btn-cart'
              onClick={() => {
                setCart([...cart, [product, selectedSize, purchaseType]]);
                localStorage.setItem("cart", JSON.stringify([...cart, [product, selectedSize, purchaseType]]));
                toast.success('Item added to cart');
              }}
              style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',  borderWidth: '0.5px', color: 'black'}}
            >
              Add to cart <GiShoppingCart style={{fontSize: '30px'}}/>
            </button>

            <button
              className='btn-cart'
              onClick={() => {
                const isInWishList = isProductInWishList(product);
                if (isInWishList) {
                  const newWish = wish.filter((wishProduct) => wishProduct._id !== product._id);
                  setWish(newWish);
                  localStorage.setItem("wish", JSON.stringify(newWish));
                  toast.success('Item removed from wishlist');
                } else {
                  const newWish = [...wish, product];
                  setWish(newWish);
                  localStorage.setItem("wish", JSON.stringify(newWish));
                  toast.success('Item added to wishlist');
                }
              }}
              style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',  borderWidth: '0.5px', color: 'black', marginLeft: '20px'}}
            >
              <div>
                <span style={{ marginRight: '8px' }}>Add to wishlist</span>
                <span><HeartIconToggle style={{ fontSize: '30px' }}/></span>
              </div>
            </button>
            </div>

          </div>
        </div>

      </div>

      <hr/>
      {/* similar products */}
      <div className=' container' style={{marginRight: '120px'}}>
        <h6 style={{marginLeft: '25px', fontSize: '28px', marginTop: '20px', marginBottom: '-20px'}}>Similar products</h6>
        {relatedProducts.length < 1 && (<p className="text-center">No Similar Products found</p>)}
        <div className="d-flex flex-wrap p-3" style={{marginLeft: '20px', margin: '5px', width: '2000px'}}>
              {relatedProducts?.map((p) => (
                <div key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p?._id}`}
                    alt={p?.name} 
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
                            setCart([...cart, [p, selectedSize, purchaseType]]);
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
    </Layout>
  )
}

export default ProductDetails
