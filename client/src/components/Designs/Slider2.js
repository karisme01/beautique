// Slider.js
import React from 'react';
import Card2 from './Card2'; // Import the Card component

const Slider2 = ({ items, onSlideClick, itemsArray }) => (
  <div style={{
    overflowX: 'scroll',
    display: 'flex',
    whiteSpace: 'nowrap',
    padding: '20px',
    margin: '0px'
  }}>
    {items.map((item, index) => (
      <Card2 key={index} title={item.title} content={item.content} image={item.image} onClick={() => onSlideClick(item, index, itemsArray)}/>
    ))}
  </div>
);

export default Slider2;
