import React, { useRef, useState} from "react";
import Slider from "react-slick";
import '../../styles/RightOnlyCarousal.css'

const RightOnlyCarousel = ({ children, onActiveSlideChange, onExpandPress, onLikePress,  onDislikePress}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expand, setExpand] = useState(false)
    const [liked, setLiked] = useState(false)
    const sliderRef = useRef();
    const settings = {
        // dots: true,
        infinite: false,
        speed: 500,
        centerMode: true,
        centerPadding: '37%', // Adjust as needed
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false,
        swipeToSlide: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: null,
    };
    const handleNextWish = () => {
        const newIndex = (currentIndex + 1) % children.length;
        setCurrentIndex(newIndex);
        sliderRef.current.slickNext();
        setExpand(false)
        setLiked(true)
        if (onLikePress) {
            onLikePress(true);
        }
        if (onActiveSlideChange) {
            onActiveSlideChange(newIndex);
            onExpandPress(false)
        }
    };
    const handleNextHate = () => {
        const newIndex = (currentIndex + 1) % children.length;
        setCurrentIndex(newIndex);
        sliderRef.current.slickNext();
        setExpand(false)
        setLiked(false)
        if (onLikePress) {
            onLikePress(false);
        }
        if (onActiveSlideChange) {
            onActiveSlideChange(newIndex);
            onExpandPress(false)
        }
    };

    const handleExpandPress = () => {
        setExpand(true)
        if (onExpandPress){
            onExpandPress(true)
        }
    }
    
    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
      };
    
    const debouncedHandleNextWish = debounce(() => {
        handleNextWish();
    }, 300);

    const debouncedHandleNextHate = debounce(() => {
        handleNextHate();
    }, 300);

    

    function SampleNextArrow(props) {
        const { onClick } = props;
        return (
            <div
                className="slick-next"
                onClick={onClick}
            />
        );
    }

    return ( 
        <div className="right-only carousel-container" style={{marginBottom: '100px'}}>
            <Slider ref={sliderRef} {...settings}>
                {children}
            </Slider>
            <div className="slider-buttons" style={{marginTop: '50px', borderRadius: '10px'}}>
                <button className="not-like-button" onClick={debouncedHandleNextHate} style={{fontSize: '24px'}}>✖ </button>
                <button className="expand-button" onClick={handleExpandPress}style={{fontSize: '21px', marginLeft: '10px'}}>↓</button>
                <button className="like-button" onClick={debouncedHandleNextWish} style={{fontSize: '21px',marginLeft: '10px'}}>♥</button>
                <button className="skip-button" onClick={debouncedHandleNextHate} style={{fontSize: '24px'}}> → </button>
            </div>
        </div>
    );
};

export default RightOnlyCarousel;
