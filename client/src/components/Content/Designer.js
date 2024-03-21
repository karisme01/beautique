import React, {useState} from 'react'
import masabaImage from '../../images/masaba-gupta.jpeg'
import rituKumarImage from '../../images/ritukumarhome.gif'
import carolineImage from '../../images/CarolineHome.jpeg'
import manImage from '../../images/man.webp'
import indImage from '../../images/ind2.webp'
import manishImage from '../../images/manish.jpeg'
import { GiClover } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'


const Designer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  return (
    <div>
       <div style={{marginBottom: '-70px'}}>
          <div className='row' style={{}}>
            <h1 className='text-center' style={{color: 'black', marginLeft: '180px', marginTop: '30px'}}>
              Meet our favourite designers <GiClover />
            </h1>

            <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative',height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginLeft: '20px'
              }}>
              <img src={rituKumarImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Ritu Kumar</h3>
              </div>
            </div>

            <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative',height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginRight: '-0px'
              }}>
              <img src={masabaImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Masaba</h3>
              </div>
            </div>

            <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative', height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginRight: '-400px'
              }}>
              <img src={carolineImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Carolina Pessi</h3>
              </div>
            </div>
          </div>

          {/* second line of designers */}
          <div className='row' style={{ marginLeft: '18px', marginTop: '97px', marginRight: '10px'}}>
          <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative',height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginRight: '-0px', marginLeft: '-10px',
                marginTop: '-65px'
              }}>
              <img src={manImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Alex Honacceni</h3>
              </div>
            </div>

            <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative',height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginRight: '-0px',
                marginTop: '-65px'
              }}>
              <img src={indImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Johnathan Parel</h3>
              </div>
            </div>


            <div className="category-card" onClick={() => navigate('/cloud-brands/Nidhi-Agarwal')}
              style={{position: 'relative',height: '300px',width: '460px',marginBlock: '-10px',borderRadius: '15px',
                borderWidth: '6px',borderColor: 'black',cursor: 'pointer',overflow: 'hidden', marginRight: '-400px',
                marginTop: '-65px'
              }}>
              <img src={manishImage} style={{
                  width: '100%',height: '100%',objectFit: 'cover',borderWidth: '15px',
                  transition: 'transform .5s ease', 
              }}/>
              <div className="category-overlay" style={{
                  position: 'absolute',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',display: 'flex',
                  alignItems: 'center',justifyContent: 'center',opacity: 0, transition: 'opacity .5s ease', 
              }}>
                <h3 style={{fontWeight: 'bold'}}>Manish Malhotra</h3>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Designer
