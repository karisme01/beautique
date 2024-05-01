// Slider.js
import React from 'react';
import Card from './Card'; // Import the Card component

const Slider1 = ({ items, height}) => (
  <div style={{
    overflowX: 'scroll',
    display: 'flex',
    whiteSpace: 'nowrap',
    padding: '20px',
    margin: '0px'
  }}>
    {items.map((item, index) => (
      <Card key={index} title={item.title} content={item.content} videoUrl={item.video} height={height}/>
    ))}
  </div>
);

export default Slider1;
