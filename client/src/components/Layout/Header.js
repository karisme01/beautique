import React from 'react';
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

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wish] = useWish();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
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
            <li className="nav-item dropdown">
              <Link to="/categories" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{color: '#3F250B' }}>
                Categories
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/categories" className="dropdown-item">
                    All Categories
                  </Link>
                </li>
                {categories?.map((category) => (
                  <li key={category._id}>
                    <Link to={`/category/${category.slug}`} className="dropdown-item">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* <li className="nav-item">
              <NavLink exact to="/trend" className="nav-link" style={{color: '#3F250B' }}>
                TRENDS
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink exact to="/for-you" className="nav-link" style={{color: '#3F250B' }}>
                FOR YOU
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/cloud-brands" className="nav-link" style={{color: '#3F250B'}}>
                CLOUD BRANDS
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <SearchInput />
            <ul className="navbar-nav ms-3">
              {auth.user ? (
                <li className="nav-item dropdown" style={{color: '#3F250B' }}>
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {auth.user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink to={`/dashboard/${auth.user.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/login" className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link" activeClassName="active" style={{color: '#3F250B' }}>
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link" activeClassName="active" style={{color: '#3F250B' }}>
                      Login
                    </NavLink>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink to="/wish" className="nav-link" activeClassName="active">
                  <Badge count={wish.length} showZero>
                    <CiHeart style={{fontSize: '30px', marginBottom: '1px', marginTop: '-5px', color: '#3F250B'}}/>
                  </Badge>
                </NavLink>
              </li>
              <li className="nav-item" style={{marginLeft: '10px', marginRight: '-30px'}}>
                <NavLink to="/cart" className="nav-link" activeClassName="active">
                  <Badge count={cart.length} showZero>
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
