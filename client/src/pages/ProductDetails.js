import Layout from '../components/Layout/Layout';
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useWish } from '../context/wish';
import StarRating from "../components/Designs/Stars"
import { IoHeartCircle } from "react-icons/io5";
import { GiShoppingCart } from "react-icons/gi";
import img from '../images/celebrities/cel1.png'
import img2 from '../images/celebrities/cel2.png'
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
  const [purchaseType, setPurchaseType] = useState('0');
  const [price, setPrice] = useState()
  const [selectedImage, setSelectedImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([
    { author: "Alice Johnson", content: "Absolutely love this! Exceeded all my expectations, would definitely recommend!" },
    { author: "Mark Benson", content: "Not what I expected based on the description. It's okay, but I probably wouldn't buy again." },
    { author: "Cindy Smith", content: "Perfect for my needs, looks exactly like the picture. Five stars!" },
    { author: "David Green", content: "Meh, it's alright. Nothing to write home about. You get what you pay for." },
    { author: "Emily Carter", content: "Stunning! I've received so many compliments. Will be purchasing more for gifts." },
    { author: "Gregory White", content: "The quality is top-notch. I was surprised by how well-made it is for the price." },
    { author: "Hannah Lee", content: "Arrived late and was smaller than I expected. It's cute but not quite what I wanted." },
    { author: "Ian Matthews", content: "Incredible value for the money. It has become a staple in my daily routine." },
    { author: "Jenny Olsen", content: "Color was a bit off from the photos. Still a good purchase, but keep that in mind." },
    { author: "Kyle Cho", content: "I had high hopes, but it fell short. The material feels cheap and not very durable." },
]);



  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  const isProductInCart = (product, selectedSize, selectedType) => {
    return cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
    );
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

  useEffect(() => {
    // Initialize selectedImage and productImages when the product is fetched
    if (product?._id) {
      setProductImages([`/api/v1/product/product-photo/${product._id}`, img,
        `/api/v1/product/product-photo/${product._id}`, img2]);
      setSelectedImage(`/api/v1/product/product-photo/${product._id}`);
    }
  }, [product]);
 
  const handlePurchaseSelection = (type) => {
    setPurchaseType(type);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
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
      <div className='row container' style={{marginTop: '30px', marginLeft: '-80px'}}>
        <div className='col-md-6' style={{marginLeft:'100px', marginRight: '60px'}}>
        <img
            src={selectedImage}
            className="card-img-top" 
            alt={product?.name}
            style={{ height: '600px', width: '400px', objectFit: 'cover', cursor: 'pointer'}}
          />

          <div style={{marginBottom: '-20px', display: 'flex', flexDirection: 'row'}}>
            <button onClick={() => setShowReviews(!showReviews)} style={{margin: '20px 0', 
              padding: '10px 20px', cursor: 'pointer', borderWidth: '0px'}}>
              {showReviews ? 'Hide Reviews' : 'See Reviews'}
            </button>
          </div>

          {
          showReviews && (
            <div className='reviews' style={{marginTop: '20px'}}>
              <div className="reviews-container">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <p style={{marginBottom: '2px'}}><strong>{review.author}:</strong></p>
                    <div style={{flexDirection:'row', marginTop: '2px'}}>
                      <StarRating rating={3} />
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }


        </div>

        {/* three extra pictures */}
        <div className='extra col-md-6' style={{marginLeft: '-360px', overflowY: 'scroll', 
            height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px'}}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '500px', marginLeft: '70px'}}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* <img
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
                  /> */}
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product ${index}`}
                      onClick={() => handleImageClick(image)}
                      style={{ height: '285px', width: '200px', marginBottom: '6px', cursor: 'pointer'}}
                      className='product-image'
                    />
                  ))}
              </div>
          </div>
        </div>


        <div className='col-md-6' style={{ marginLeft: '730px', marginTop: showReviews ? '-1013px' : '-693px' }}>
          <div classname="text-center" style={{width: '610px', height: '300px', marginTop: '30px', 
            borderWidth: '20px', backgroundColor: '#efefef', marginLeft: '20px', marginBottom: '15px'}}>
              <h1 style={{fontSize: '20px', padding: '20px', fontWeight: 'bold'}}>
              Take it on lease and enjoy luxury while saving thousands with easy returns and services.
              </h1>
              <p style={{fontSize: '13px', padding: '25px', marginTop: '-30px', color: 'grey'}}>
                Experience the luxury of a diverse wardrobe with Karisme Collections' 4-day and 7-day clothing options. 
                Say goodbye to buyer's remorse. Embrace a movement that champions confidence, ambition, and eco-conscious living. 
              </p>

              <div style={{display: 'flex', flexDirection: 'row', marginTop: '-20px'}}>
                <button style={{marginLeft: '100px', height: '40px', width: '200px', color: 'white', backgroundColor: 'black'}}>
                  Check leasing policy
                </button>
                <button style={{marginLeft: '10px', height: '40px', width: '200px', color: 'white', backgroundColor: 'black'}}>
                  Check return policy
                </button>
              </div>
              <div style={{fontSize: '15px', marginLeft: '200px'}}>
                <p style={{marginTop: '20px', textDecoration: 'underline'}}>Reserve event leasing here</p>
              </div>
          </div>
          {/* video */}
          {/* <div>
            <video width="100%" height="auto" controls style={{ marginBottom: '20px' }}>
              <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
          </div> */}

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
              background: purchaseType === '0' ? '#332211' : '#fff',
              color: purchaseType === '0' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('0')}>
              <p>Buy</p>
              <p>Price: {product?.price}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '1' ? '#332211' : '#fff',
              color: purchaseType === '1' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('1')}>
              <p>Lease for 3 days</p>
              <p>Price: {String(Math.round(0.3*price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '2' ? '#332211' : '#fff',
              color: purchaseType === '2' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('2')}>
              <p>Lease for 7 days</p>
              <p>Price: {String(Math.round(0.4*price / 10) * 10)}</p>
            </button>
          </div>
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <button
              className='btn-cart'
              onClick={() => {
                if (!isProductInCart(product, selectedSize, purchaseType)) {
                  setCart([...cart, [product, selectedSize, purchaseType, 0, 1]]);
                  localStorage.setItem("cart", JSON.stringify([...cart, [product, selectedSize, purchaseType]]));
                  toast.success('Item added to cart');
                }else {
                  const newCart = cart.filter(cartItem => 
                    !(cartItem[0]._id === product._id && 
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
                backgroundColor: isProductInCart(product, selectedSize, purchaseType) ? '#FFF5EE	' : 'white' // Change the color based on the item's presence in the cart
              }}
            >
              {isProductInCart(product, selectedSize, purchaseType) ? 'Added to cart' : 'Add to cart'}
              <GiShoppingCart style={{fontSize: '30px'}}/>
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
              alignItems: 'center', justifyContent: 'center',  borderWidth: '0.5px', color: 'black', marginLeft: '20px', 
              backgroundColor: isProductInWishList(product) ? '#FFF5EE' : 'white'}}
            >
              <div>
                <span style={{ marginRight: '8px' }}>
                  {isProductInWishList(product) ? 'Added to wishlist' : 'Add to wishlist'}
                </span>
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

                        <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '-0px' }} 
                          onClick={()=>{
                            setCart([...cart, [p, selectedSize, purchaseType, 0, 1]]);
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
