import React from 'react';
import Layout from '../components/Layout/Layout';
import '../styles/About.css'; // Ensure this path matches your project structure

const About = () => {
  return (
    <Layout title={'About Us'}>
      <div className="about-container">
        <h1>Crafting Confidence Through Fashion</h1>
        <p>
          Welcome to Karisme, your premier destination for designer clothing and innovative leasing options. We believe in making high-end fashion accessible to everyone, empowering you to look your best without breaking the bank.
        </p>
        
        <h2>Our Story</h2>
        <p>
          Founded with a vision to uplift thousands of Indians, Karisme aims to break the aspirational barriers imposed by financial restrictions. Our journey began when we noticed the gap in access to designer fashion. Karisme was born from the desire to fill this gap, offering a platform where luxury is accessible, and fashion-forward individuals can express themselves without limitations.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide affordability, aspiration, and confidence through our curated selection of designer wear. We aim to remove financial barriers to high-end fashion, making it possible for everyone to look their best and feel confident in their skin.
        </p>
        
        <h2>Why Choose Karisme?</h2>
        <p>
          What sets Karisme apart is our commitment to sustainability, quality, and inclusivity. Our leasing options not only make fashion more accessible but also encourage a sustainable approach to consumerism. We believe in quality over quantity and strive to offer an inclusive range that caters to diverse tastes and preferences.
        </p>
        
        <h2>Join Our Journey</h2>
        <p>
          Explore our collections and discover the Karisme difference. From leasing a statement piece for a special event to finding the perfect addition to your wardrobe, we're here to ensure you step out in style and confidence. Let's redefine fashion together.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          Have questions or need assistance? Our team is here to help. Reach out to us at <a href="mailto:support@karisme.com">support@karisme.com</a>, or connect with us on social media. Stay updated with our latest collections and special offers.
        </p>
      </div>
    </Layout>
  );
}

export default About;
