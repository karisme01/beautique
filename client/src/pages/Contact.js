import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import contactPage from '../images/contactPage.jpeg'

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus">
        <div className="col-md-6" style={{marginLeft: '10px', marginRight: '-20px'}}> 
          <img
            src={contactPage}  // Update the image path as needed
            alt="Customer Support"
            style={{ width: "100%", height: 'auto' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="bg-dark p-3 text-white text-center">Contact Us</h1>
          <div className="p-4">
            <p className="text-justify">
              For any queries or information about our products, feel free to contact us anytime. We are available 24/7 for your support.
            </p>
            <p className="mt-3">
              <BiMailSend /> : karisme@gmail.com
            </p>
            <p className="mt-3">
              <BiPhoneCall /> : +91 9875526063
            </p>
            <p className="mt-3">
              {/* If you still want to keep the toll-free line, you can leave this, or else you can remove it if not needed */}
              <BiSupport /> : 1800-0000-0000 (Toll-Free)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
