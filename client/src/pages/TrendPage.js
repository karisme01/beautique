import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout.js';
import "../styles/Homepage.css";
import { GiClover } from "react-icons/gi";
import { GiCrystalGrowth } from "react-icons/gi";
import masabaImage from '../images/masaba-gupta.jpeg'
import rituKumarImage from '../images/ritukumarhome.gif'
import carolineImage from '../images/CarolineHome.jpeg'
import manImage from '../images/man.webp'
import indImage from '../images/ind2.webp'
import manishImage from '../images/manish.jpeg'
import Slider1 from '../components/Designs/Slider1.js';
import Slider2 from '../components/Designs/Slider2.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {sliderItems1} from '../components/Content/SliderItem1.js'
import {sliderItems2} from '../components/Content/SliderItem2.js'
import {sliderCelebrities} from '../components/Content/SliderCelebrities.js'

const TrendPage = () => {
  return (
    <Layout>
        <div>
          {/* <div className='row' style={{}}>
            <h1 className='text-center' style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px', marginTop: '30px'}}>
              Meet our favourite designers <GiClover />
            </h1>
            <div className='col-md-4'>
              <div style={{ width: '25rem', height: '15rem', cursor: 'pointer', marginLeft: '20px'}}>
                <img
                  src={rituKumarImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 1'
                  style={{ height: '330px', objectFit: 'cover', width: '460px', marginRight: '100px'}}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '25rem', height: '15rem', cursor: 'pointer', marginLeft: '-5px' }}>
                <img
                  src={masabaImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 2'
                  style={{ height: '330px', objectFit: 'cover', width: '460px', marginLeft: '10px' }}
                />
                <div className='card-body'>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '25rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={carolineImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 3'
                  style={{ height: '330px', objectFit: 'cover', width: '460px', marginLeft: '-10px' }}
                />
              </div>
            </div>
          </div> */}

          {/* second line of designers */}
          {/* <div className='row' style={{ marginLeft: '7px', marginTop: '97px', marginRight: '10px'}}>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={manImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 1'
                  style={{ height: '330px', objectFit: 'cover', width: '460px'}}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={indImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 2'
                  style={{ height: '330px', objectFit: 'cover', width: '460px', marginLeft: '-0px'}}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={manishImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 3'
                  style={{ height: '330px', objectFit: 'cover', width: '460px', marginLeft: '-0px' }}
                />
              </div>
            </div>
          </div> */}
        </div>

        {/* <div style={{height:'50px'}}></div> */}

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '50px', marginBottom: '-40px' }}>
          <h1 style={{ marginRight: '-400px', fontWeight: 'bold'}}>Latest Trends <GiCrystalGrowth /> </h1>
          <div className='' style={{marginRight: '-302px', marginTop: '-30px'}}>
            <Slider1 items={sliderItems1} />
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
        <h3 style={{marginLeft: '-920px', marginBottom: '-30px', marginTop: '40px', fontSize: '30px'}}>Guides</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderItems2}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{marginLeft: '-760px', marginBottom: '-30px', marginTop: '30px', fontSize: '30px'}}>Celebrity Spotlight</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderCelebrities}/>
          </div>
        </div>

        <div className='col-md-9' style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{marginLeft: '-870px', marginBottom: '-30px', marginTop: '30px', fontSize: '30px'}}>Celebrities</h3>
          <div className='' style={{marginRight: '-300px'}}>
            <Slider2 items={sliderItems2}/>
          </div>
        </div>
    </Layout>
  )
}

export default TrendPage
