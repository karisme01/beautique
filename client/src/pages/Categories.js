import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import sariImage from "../images/sari.webp"
import salwarImage from "../images/salwar_kameez.webp"
import lehengaImage from "../images/lehenga_choli.webp"
import kurtiImage from "../images/kurtis.webp"
import skirtImage from "../images/skirts.webp"
import jewelImage from "../images/jewellery.webp"
import regionalImage from "../images/regional.webp"
import indoWesternImage from "../images/indowestern.webp"
import womenImage from "../images/women.webp"
import { useNavigate } from "react-router-dom";
import "../styles/Categories.css"



const Categories = () => {
  const categories = useCategory();
  const navigate = useNavigate()
  const map = new Map();
  map.set('Sari', sariImage);
  map.set('Salwar Kameez', salwarImage);
  map.set('Lehenga Choli', lehengaImage);
  map.set('Kurtis & Tunics', kurtiImage);
  map.set('Ethnic Skirts & Bottoms', skirtImage);
  map.set('Indo-Western Wear', indoWesternImage);
  map.set('Accessories', jewelImage);
  map.set('Regional Specialties', regionalImage);
  map.set('Women', womenImage);


  return (
    <Layout title={"All Categories"}>
      <div className="container" style={{ marginTop: "70px"}}>
        <div style={{marginLeft: '60px', fontWeight: 'bold'}}>
          <h1>ALL CATEGORIES</h1>
        </div>
        <div className="row container" style={{marginLeft: '20px', marginBottom: '60px'}}> 
        {categories.map((c) => (
          <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
            <div className="category-card" onClick={() => navigate(`/category/${c.slug}`)}
              style={{
                position: 'relative',
                height: '300px',
                width: '380px',
                marginBlock: '-10px',
                borderRadius: '15px',
                borderWidth: '6px',
                borderColor: 'black',
                cursor: 'pointer',
                overflow: 'hidden', // Ensure the overlay fits within the card
              }}>
              <img src={map.get(c.name)} alt={c.name} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderWidth: '15px',
                  transition: 'transform .5s ease', // Smooth transition for zoom effect
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.65)', // Dark overlay
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0, // Initially hidden
                  transition: 'opacity .5s ease', // Smooth transition for the overlay
              }}>
                <h3 style={{fontWeight: 'bold'}}>{c.name}</h3>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </Layout>
  );
};



export default Categories;


