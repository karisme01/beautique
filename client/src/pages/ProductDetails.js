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
import { Modal, Button, DatePicker } from 'antd';
import toast from 'react-hot-toast';
import TopSlider from '../components/Designs/TopSlider';
import HeartIconToggle from '../components/Designs/HeartIconToggle';
import moment from 'moment';
import { useReserve } from '../context/reserve';


const ProductDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [cart, setCart] = useCart()
  const [reserve, setReserve] = useReserve()
  const [relatedProducts, setRelatedProducts] = useState([])
  const [wish, setWish] = useWish();
  const [selectedSize, setSelectedSize] = useState(""); 
  const [purchaseType, setPurchaseType] = useState('0');
  const [price, setPrice] = useState()
  const [selectedImage, setSelectedImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [showReviews, setShowReviews] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [itemDetailsPressed, setItemDetailsPressed] = useState(false)
  const [deliveryDetailsPressed, setDeliveryDetailsPressed] = useState(false)
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

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
    }
  }, [product]);
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isProductInWishList = (product) => {
    return wish.some((wishProduct) => wishProduct._id === product._id);
  };

  const isProductInReserve = (product, selectedSize, selectedType) => {
    return reserve.some(reserveItem => 
      reserveItem[0]._id === product._id && reserveItem[1] === selectedSize && reserveItem[2] === selectedType
    );
  };

  const addToReserve = (product, selectedSize, purchaseType, date) => {
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions to proceed.");
      return;
    }
    if (!selectedSize) {
      toast.error('Select the size');
      return
    }
    if (purchaseType != '1' && purchaseType != '2') {
      toast.error('Select the purchase type');
      return
    }
    if (!date) {
      toast.error('Select the reservation date');
      return
    }
    if (!isProductInReserve(product, selectedSize, purchaseType)) {
      setReserve([...reserve, [product, selectedSize, purchaseType, 0, 1, date]]);
      localStorage.setItem("reserve", JSON.stringify([...reserve, [product, selectedSize, purchaseType, 0, 1, date]]));
      toast.success('Item added to reserve');
      setIsModalVisible(false)
    }
    // }else {
    //   const newReserve = reserve.filter(reserveItem => 
    //     !(reserveItem[0]._id === product._id && 
    //       reserveItem[1] === selectedSize && 
    //       reserveItem[2] === purchaseType));
    //   setReserve(newReserve);
    //   localStorage.setItem("reserve", JSON.stringify(newReserve));
    //   toast.success('Item removed from reserve');
    //   setIsModalVisible(false)
    // }
  }

  const isProductInCart = (product, selectedSize, selectedType) => {
    return cart.some(cartItem => 
      cartItem[0]._id === product._id && cartItem[1] === selectedSize && cartItem[2] === selectedType
    );
  };

  const addToCart = (product, selectedSize, purchaseType) => {
    if (!isProductInCart(product, selectedSize, purchaseType)) {
      setCart([...cart, [product, selectedSize, purchaseType, 0, 1]]);
      localStorage.setItem("cart", JSON.stringify([...cart, [product, selectedSize, purchaseType, 0, 1]]));
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
  }

  const calculateReturnDate = () => {
    if (!selectedDate) return ''; // No selected date
    const duration = purchaseType === '1' ? 3 : 7; // '1' for 3 days, else assume 7 days
    const returnDate = moment(selectedDate).add(duration, 'days').format('YYYY-MM-DD');
    return `${returnDate}`;
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

  const toggleItemDetails = () => {
    setItemDetailsPressed(!itemDetailsPressed);
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
            style={{ height: '790px', width: '500px', objectFit: 'cover', cursor: 'pointer'}}
          />
        </div>

        {/* three extra pictures */}
        <div className='extra col-md-6' style={{marginLeft: '-260px', overflowY: 'scroll', 
            height: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px'}}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '500px', marginLeft: '70px'}}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product ${index}`}
                      onClick={() => handleImageClick(image)}
                      style={{ height: '235px', width: '200px', marginBottom: '6px', cursor: 'pointer'}}
                      className='product-image'
                    />
                  ))}
              </div>
          </div>
        </div>


        <div className='col-md-6' style={{ marginLeft: '810px', marginTop: showReviews ? '-793px' : '-793px' , paddingLeft: '50px'}}>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <h1>{product?.name}</h1>
              {/* <StarRating rating={product.rating || 3} /> */}
            </div>
            <p style={{ marginBottom: '10px', fontSize: '16px', letterSpacing: '1.2px'}}>
              {product?.description}
            </p>
            <hr/>
            <div>
            <div className='column'>
                <p className='mt-4' style={{fontSize: '18px', color: 'darkred'}}>
                  Only 4 left in stock! You don't want to be late
                </p>
                <p style={{ marginBottom: '10px', fontSize: '36px', color: 'darkgreen', marginRight: '15px', marginTop: '-20px'}}>
                  Rs {product?.price}
                </p>
              </div>
            </div>
            <hr/>
              <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                <strong>CATEGORY:</strong> {product?.category?.name}
              </p>
            <div className='btn-sizes' style={{marginLeft: '-10px', marginBottom: '20px'}}>
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelection(size)}
                style={{
                  width: '65px',
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

          {product && product.rent && 
          <div className='flex-row' style={{marginBottom: '20px', marginRight: '-60px'}}>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '0' ? '#332211' : '#fff',
              color: purchaseType === '0' ? '#fff' : '#000',
              }} onClick={()=>handlePurchaseSelection('0')}>
              <p>Buy</p>
              <p>Price: {product?.price}</p>
            </button>
            <button className='btn-options' 
              style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '1' ? '#332211' : '#fff',
              color: product.rent ? (purchaseType === '1' ? '#fff' : '#000') : '#666666',
              cursor: product.rent ? 'pointer' : 'not-allowed'
              }} onClick={()=>handlePurchaseSelection('1')} disabled={!product.rent}>
              <p>Half-weekly cycle</p>
              <p>Price: {String(Math.round(0.3*price / 10) * 10)}</p>
            </button>
            <button className='btn-options' style={{width: '200px', height: '100px', 
              marginRight: '10px', borderRadius: '5%', borderWidth: '0.5px', 
              background: purchaseType === '2' ? '#332211' : '#fff',
              color: product.rent ? (purchaseType === '1' ? '#fff' : '#000') : '#666666',
              cursor: product.rent ? 'pointer' : 'not-allowed'
              }} onClick={()=>handlePurchaseSelection('2')} disabled={!product.rent}>
              <p>Full-weekly cycle</p>
              <p>Price: {String(Math.round(0.4*price / 10) * 10)}</p>
            </button>
          </div>
          }
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <button
              className='btn-cart'
              onClick={() => {
                if (!isProductInCart(product, selectedSize, purchaseType)) {
                  setCart([...cart, [product, selectedSize, purchaseType, 0, 1]]);
                  localStorage.setItem("cart", JSON.stringify([...cart, [product, selectedSize, purchaseType, 0, 1]]));
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
            <hr/>
            <p style={{ marginBottom: '5px', fontSize: '16px', cursor: 'pointer'}} onClick={() => setItemDetailsPressed(!itemDetailsPressed)}>
              <strong>ITEM DETAILS</strong> 
            </p>
            <div className={`details-content ${itemDetailsPressed ? 'open' : ''}`}>
              {product.material}, No scope of allergy
            </div>
            <hr/>
            <p style={{ marginBottom: '10px', fontSize: '16px', cursor: 'pointer'}}>
              <strong>STYLIST COMMENTS</strong> 
            </p>
            <hr/>
            <p style={{ marginBottom: '10px', fontSize: '16px', cursor: 'pointer'}} onClick={() => setDeliveryDetailsPressed(!deliveryDetailsPressed)}>
              <strong>DELIVERY AND RETURNS</strong> 
            </p>
            <div className={`details-content ${deliveryDetailsPressed ? 'open' : ''}`}>
              <p>7-10 days delivery</p>
              <p>Return & Exchange valid till 1 month since purchase</p>
              <p>Rs 60 delivery cost</p>
            </div>
            <hr/>
            <p style={{ marginBottom: '10px', fontSize: '16px', cursor: 'pointer'}}>
              <strong>ORIGIN</strong> 
            </p>
            <hr/>
          </div>
        </div>
      </div>

      <div className='review-container'>
        {reviews.map((review, index) => (
          <div key={index} className="review-box">
            <p style={{marginBottom: '2px'}}><strong>{review.author}:</strong></p>
            <div style={{flexDirection:'row', marginTop: '2px'}}>
              <StarRating rating={3} /> {/* Assuming each review shows a static 3-star rating for now */}
            </div>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
      {/* similar products */}
      <div className=' container' style={{marginRight: '120px'}}>
        <h6 style={{marginLeft: '25px', fontSize: '28px', marginTop: '60px', marginBottom: '-20px'}}>YOU MIGHT ALSO LIKE THESE</h6>
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
                      {/* <div style={{marginLeft: '6px', flexDirection:'row', marginTop: '2px'}}>
                        <StarRating rating={p.rating || 3} />
                      </div> */}
                      <div style={{fontSize: '25px', marginLeft: '220px', marginTop:'-40px', marginBottom: '16px'}}>
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

                        {/* <GiShoppingCart style={{fontSize: '40px', color: 'black', cursor: 'pointer', padding:'2px', marginTop: '-0px' }} 
                          onClick={()=>{
                            setCart([...cart, [p, selectedSize, purchaseType, 0, 1]]);
                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                            toast.success('Item added to cart');
                          }}/> */}
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
