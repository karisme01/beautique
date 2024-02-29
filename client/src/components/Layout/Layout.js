import React from 'react'
import Header from './Header.js'
import Footer from './Footer.js'
import {Helmet} from 'react-helmet'
import {Toaster} from 'react-hot-toast'

const Layout = ({children, title, description, keywords, author}) => {
  return (
    <div>
      <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <title>{title}</title>
          </Helmet>
        <Header/>
        <main style = {{minHeight: '70vh'}}>{children}</main>
        <Toaster/>
        <Footer/>
    </div>
  );
};

Layout.defaultProps = {
  title: 'Karisme - Shop now',
  description: 'Boutique brand',
  keywords: 'boutique service',
  author: 'Yugam Surana'
}

export default Layout



