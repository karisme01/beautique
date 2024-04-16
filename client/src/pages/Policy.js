import React from 'react';
import Layout from '../components/Layout/Layout';
import { MdPolicy } from 'react-icons/md';
import { IoReturnUpBack, IoShieldCheckmark } from 'react-icons/io5';
import { FaHandHoldingHeart } from 'react-icons/fa';
import TopSlider from '../components/Designs/TopSlider.js';

const Policy = () => {
  const topSliderItems = [
    { id: 1, content: "Complimentary Delivery on Orders Over Rs 4000" },
    { id: 2, content: "Seamless Return Process" },
    { id: 3, content: "Premium Quality at Competitive Prices" },
    { id: 4, content: "Enjoy Discounts with COUPON CODE: A82HD2" }
  ];

  return (
    <Layout title={'Policies'}>
      <TopSlider items={topSliderItems}/>
      <div style={{ display: 'flex', margin: '0 auto', maxWidth: '1200px' }}>
        <div style={{ flex: '1', marginRight: '20px', marginTop: '40px' }}>
          <h3>Navigation</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#leasing-policy">Leasing Policy</a></li>
            <li><a href="#return-extension-policy">Return & Extension Policy</a></li>
            <li><a href="#cancellation-policy">Cancellation Policy</a></li>
            <li><a href="#reservations">Reservations</a></li>
            <li><a href="#insurance-policy">Insurance Policy</a></li>
          </ul>
        </div>
        <div style={{ flex: '4', margin: '40px 20px', maxWidth: '800px' }}>
          <h1 id="top">Our Policies <MdPolicy size={30}/></h1>
          
          <section id="leasing-policy" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              <FaHandHoldingHeart size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Leasing Policy
            </h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              Our flexible leasing options include 4-day and 7-day periods, tailored to accommodate your needs and schedule. The lease term commences upon collection of the item and requires prompt return upon completion of the term. For those who require additional time, lease extensions are available at a nominal fee of Rs 100 per day, accessible through <a href="#extend-lease">our extension page</a>.
            </p>
          </section>
          
          <section id="return-extension-policy" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              <IoReturnUpBack size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Return & Extension Policy
            </h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              We strive to make our return process as seamless as possible. Items should be returned in their original condition at the end of the lease period. Should you wish to retain your item longer than the agreed term, extensions can be efficiently facilitated online, ensuring continued enjoyment of your selected garments.
            </p>
          </section>

          <section id="cancellation-policy" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              Cancellation Policy
            </h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              We understand that plans may change. Cancellations made within 24 hours of a transaction are processed without any fee. Post this grace period, a nominal charge of Rs 300 applies. For reservations, a cancellation fee of Rs 500 is charged to compensate for the scheduling adjustments.
            </p>
          </section>

          <section id="reservations" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              Reservations
            </h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              Reserve your desired item for any available date in advance to ensure availability. A cancellation of a reservation incurs a Rs 500 fee, reflecting the exclusivity and preparation involved in reserving specific items.
            </p>
          </section>

          <section id="insurance-policy" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              <IoShieldCheckmark size={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Insurance Policy
            </h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              Our comprehensive insurance policy ensures that you can enjoy your leased items without concern. Minor wear and tear are covered fully, while we share the cost of significant damage, covering 50% of repair costs. This policy is designed to ensure both peace of mind and the preservation of our high-quality collection.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Policy;
