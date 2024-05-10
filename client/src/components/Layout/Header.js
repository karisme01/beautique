import React, {useState, useEffect} from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GiAbstract003 } from 'react-icons/gi';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { useWish } from '../../context/wish';
import { Badge } from 'antd';
import { CiHeart } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { useReserve } from '../../context/reserve';
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [auth, setAuth] = useAuth(); 
  const [cart] = useCart();
  const [reserve] = useReserve()
  const [wish] = useWish();
  const categories = useCategory();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
        setIsVisible(false);
      } else { // if scroll up show the navbar
        setIsVisible(true);
      }
      // update lastScrollY
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  useEffect(() => {
    const handleScroll = throttle(controlNavbar, 100);
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  

  return (
    
    <nav className={`navbar navbar-expand-lg navbar-light ${!isVisible && 'navbar-hidden'}`}> 
      <div className="container">
      <Link to="/" className="navbar-brand" style={{ fontSize: '38px', color: '#3F250B' }}>
        <GiAbstract003 /> Karisme
      </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <NavLink exact to="/" className="nav-link" activeClassName="active" style={{color: '#3F250B' }}>
                Home
              </NavLink>
            </li> */}
            <li className="nav-item dropdown dropdown-hover m-2">
              <Link to="/categories" className="nav-link dropdown-toggle no-dropdown-arrow" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{color: '#3F250B' }}>
                Categories
              </Link>
              <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                {/* <li>
                  <Link to="/categories" className="dropdown-item">
                    All Categories
                  </Link>
                </li> */}
                {categories?.map((category) => (
                  <li key={category._id}>
                    <Link to={`/category/${category.slug}`} className="dropdown-item">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            
            <li className="nav-item m-2">
              <NavLink 
                to="/for-you" 
                className={`nav-link ${!auth.user ? 'disabled-link' : ''}`} 
                style={{ color: !auth.user ? '#A9A9A9' : '#3F250B', pointerEvents: !auth.user ? 'none' : 'auto' }}
                onClick={(e) => !auth.user && e.preventDefault()}>
                FOR YOU
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink exact to="/cloud-brands" className="nav-link" style={{color: '#3F250B'}}>
                CLOUD BRANDS
              </NavLink>
            </li>
             */}
            {/* <li className="nav-item">
              <NavLink 
                to="/ask" 
                className={`nav-link ${!auth.user ? 'disabled-link' : ''}`} 
                style={{ color: !auth.user ? '#A9A9A9' : '#3F250B', pointerEvents: !auth.user ? 'none' : 'auto' }}
                onClick={(e) => !auth.user && e.preventDefault()}>
                ASK
              </NavLink>
            </li> */}

          </ul>
          <div className="d-flex align-items-center">
            <SearchInput />
            <ul className="navbar-nav ms-3 mt-1">
              {auth.user ? (
                <li className='nav-item m-2'>
                <NavLink 
                  to={`/dashboard/${auth.user.role === 1 ? 'admin' : auth.user.role === 2 ? 'brand/profileBrand' : 'user/profile'}`} 
                  className="nav-link">
                      <FaUserCircle className='' style={{fontSize: '30px'}}/>
                </NavLink>
              </li>
              ) : (
                <>
                  <li className='nav-item m-2'>
                    <NavLink to="/register" className="nav-link" activeClassName="active" style={{color: '#3F250B' }}>
                      Register
                    </NavLink>
                  </li>
                  <li className='nav-item m-2'>
                    <NavLink to="/login" className="nav-link" activeClassName="active" style={{color: '#3F250B' }}>
                      Login
                    </NavLink>
                  </li>
                </>
              )}
              <li className='nav-item m-2'>
                <NavLink to="/wish" className="nav-link mt-1" activeClassName="active">
                  <Badge count={wish.length} showZero style={{backgroundColor: '#CC0033'}}>
                    <CiHeart style={{fontSize: '30px', marginBottom: '1px', marginTop: '-5px', color: '#3F250B'}}/>
                  </Badge>
                </NavLink>
              </li>
              <li className='nav-item m-2' style={{marginLeft: '10px', marginRight: '-30px'}}>
                <NavLink to="/cart" className="nav-link mt-1" activeClassName="active">
                  <Badge count={cart.length + reserve.length} showZero style={{backgroundColor: '#CC0033'}}>
                    <GiShoppingCart style={{fontSize: '35px', marginBottom: '1px', marginTop: '-5px', color: '#3F250B'}}/>
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

