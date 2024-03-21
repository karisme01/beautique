import React from 'react';
import Layout from '../components/Layout/Layout';
import { MdPolicy } from 'react-icons/md';
import { IoReturnUpBack, IoShieldCheckmark } from 'react-icons/io5';
import { FaHandHoldingHeart } from 'react-icons/fa';
import TopSlider from '../components/Designs/TopSlider.js';


const Policy = () => {
  const topSliderItems = [
    { id: 1, content: "Free Delivery over Rs 4000" },
    { id: 2, content: "Hassle-free return process" },
    { id: 3, content: "Greater quality, lower price" },
    { id: 4, content: "Flat sale - COUPON CODE: A82HD2" }
  ];
  return (
    <Layout title={'Policies'}>
      <TopSlider items={topSliderItems}/>
      <div style={{ margin: '40px auto', maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>Our Policies <MdPolicy size={30}/></h1>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            <FaHandHoldingHeart size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Leasing Policy
          </h2>
          <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
            Embrace high-quality fashion with our leasing policy, offering you a flexible and convenient way to dress up for any occasion without the commitment. Our service promotes a sustainable fashion cycle, allowing these garments to bring joy to more than one owner. Simply choose, wear, and return - letting fashion be a shared pleasure.
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            <IoReturnUpBack size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Return Policy
          </h2>
          <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
            We aim for complete satisfaction with our easy return policy. Items can be returned within a day for a full refund or exchange, given they are in their original, unworn condition. Leased items should be returned with all provided accessories using our straightforward return service, ensuring a hassle-free experience for our valued customers.
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            <IoShieldCheckmark size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Insurance Policy
          </h2>
          <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
            Our insurance policy is designed to let you enjoy your special moments worry-free. It covers minor wear and tear, ensuring that small accidents don't lead to big worries. For more significant damages, a nominal fee ensures that our collection remains pristine for everyone to enjoy.
          </p>
        </section>
      </div>
    </Layout>
  )
}

export default Policy;
