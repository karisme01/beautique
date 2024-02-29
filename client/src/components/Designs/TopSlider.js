import React, { useState, useEffect } from 'react';
import '../../styles/TopSlider.css'; // Ensure you create and import the relevant CSS

const TopSlider = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(nextIndex);
      }, 5000); // Change slide every 5 seconds
  
      return () => clearTimeout(timer); // Clear timer on unmount
    }, [currentIndex, items.length]);
  
    return (
      <div className="top-slider">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="slider-segment text-center"
            style={{ transform: `translateX(-${currentIndex * 100}%)`, fontSize: '20px', 
                height: '50px', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
            <div style={{marginTop: '10px', color: 'white'}}>
                {item.content}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default TopSlider;