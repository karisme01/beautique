import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='footer'>
      <h4 className='text-center'>
        All Rights Reserved &copy; Karisme
      </h4>
      <nav className='text-center mt-3'>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/policy">Policy</Link>
      </nav>
    </footer>
  );
}

export default Footer;
