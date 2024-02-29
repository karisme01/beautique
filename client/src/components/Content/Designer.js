import React from 'react'
import masabaImage from '../../images/masaba-gupta.jpeg'
import rituKumarImage from '../../images/ritukumarhome.gif'
import carolineImage from '../../images/CarolineHome.jpeg'
import manImage from '../../images/man.webp'
import indImage from '../../images/ind2.webp'
import manishImage from '../../images/manish.jpeg'
import { GiClover } from "react-icons/gi";


const Designer = () => {
  return (
    <div>
       <div>
          <div className='row' style={{}}>
            <h1 className='text-center' style={{ fontWeight: 'bold', color: 'black', marginLeft: '180px', marginTop: '30px'}}>
              Meet our favourite designers <GiClover />
            </h1>
            <div className='col-md-4'>
              <div style={{ width: '25rem', height: '15rem', cursor: 'pointer', marginLeft: '30px'}}>
                <img
                  src={rituKumarImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 1'
                  style={{ height: '330px', objectFit: 'cover', width: '445px', marginRight: '100px'}}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '25rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={masabaImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 2'
                  style={{ height: '330px', objectFit: 'cover', width: '445px', marginLeft: '120px' }}
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
                  style={{ height: '330px', objectFit: 'cover', width: '445px', marginLeft: '210px' }}
                />
              </div>
            </div>
          </div>

          {/* second line of designers */}
          <div className='row' style={{ marginLeft: '18px', marginTop: '97px', marginRight: '10px'}}>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={manImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 1'
                  style={{ height: '330px', objectFit: 'cover', width: '445px'}}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={indImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 2'
                  style={{ height: '330px', objectFit: 'cover', width: '445px', marginLeft: '107px' }}
                />
              </div>
            </div>
            <div className='col-md-4'>
              <div style={{ width: '24rem', height: '15rem', cursor: 'pointer' }}>
                <img
                  src={manishImage}
                  className='shadow-lg card-img-top'
                  alt='Designer 3'
                  style={{ height: '330px', objectFit: 'cover', width: '445px', marginLeft: '215px' }}
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Designer
