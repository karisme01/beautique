import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="client/src/images/05d456fda1cac5e1c2483d7c1d9eed98.jpeg"  // Update the image path as needed
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
              <BiMailSend /> : www.help@ecommerceapp.com
            </p>
            <p className="mt-3">
              <BiPhoneCall /> : 012-3456789
            </p>
            <p className="mt-3">
              <BiSupport /> : 1800-0000-0000 (Toll-Free)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
