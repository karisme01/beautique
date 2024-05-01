import React, { useState } from 'react';
import { Modal, Button, DatePicker, Input } from 'antd';
import BrandMenu from '../../components/Layout/BrandMenu';
import Layout from '../../components/Layout/Layout';
import '../../styles/Outreach.css'; // Ensure your styles are correctly imported
import webOut from '../../images/website-outreach.png';
import whatsappOut from '../../images/whatsapp-outreach.avif';
import newsletterOut from '../../images/newletter-outreach.jpeg';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';


const Outreach = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputText, setInputText] = useState('');
  const [auth] = useAuth();


  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const disabledDate = (current) => {
    // Can not select days except Sunday
    return current && current.day() !== 0;
  };
   
  const openModal = (type) => {
    setRequestType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
      setModalVisible(false);
      setRequestType('');
      setSelectedDate(null);
  }

  const sendRequest = async () => {
    try {
      const response = await axios.post(`/api/v1/brand/create-ad-request`, {
        userId: auth?.user._id,
        selectedDate,
        requestType,
        inputText
    });
      toast.success('Request sent')
      setModalVisible(false);
      setRequestType('');
      setSelectedDate(null);
    } catch (error) {
      console.error("Error sending ad request:", error);
      toast.error("Failed to send ad request");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const displaySelectedWeek = () => {
    if (selectedDate) {
      const startOfWeek = selectedDate.clone().startOf('isoWeek');
      const endOfWeek = startOfWeek.clone().add(6, 'days');
      return `${startOfWeek.format('YYYY-MM-DD')} to ${endOfWeek.format('YYYY-MM-DD')}`;
    }
    return 'No week selected';
  };

  return (
    <Layout>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu />
          </div>
          <div className='col-md-9'>
            <div className="row g-4"> {/* Bootstrap class for grid spacing */}
              {/* Outreach through Homepage */}
              <div className="col-md-4 card-container">
                <div className="card text-center d-flex flex-column shadow">
                  <img src={webOut} className="card-img-top-outreach" alt="Homepage Outreach" />
                  <div className="card-body d-flex flex-grow-1 flex-column">
                    <h5 className="card-title">Homepage Outreach</h5>
                    <ul className="text-start flex-grow-1">
                      <li>Feature your designs prominently on the homepage</li>
                      <li>Reach thousands of visitors daily</li>
                      <li>Maximize exposure and sales</li>
                      <li>Get featured along with the best designers in India</li>
                      <li>30% higher conversion rate in terms of views</li>
                      <li>Rs 5000/- for one week with 50% discount on the first occasion</li>
                    </ul>
                    <button className="btn btn-black mt-auto" onClick={() => openModal('Homepage')}>Submit Request</button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Outreach */}
              <div className="col-md-4 card-container">
                <div className="card text-center d-flex flex-column shadow">
                  <img src={whatsappOut} className="card-img-top-outreach" alt="Whatsapp Outreach" />
                  <div className="card-body d-flex flex-grow-1 flex-column">
                    <h5 className="card-title">WhatsApp Outreach</h5>
                    <ul className="text-start flex-grow-1">
                      <li>Direct engagement with customers via WhatsApp</li>
                      <li>Send updates and promotions directly</li>
                      <li>Personalized shopping experience</li>
                      <li>70% higher conversion rate in terms of views</li>
                      <li>Rs 20/- for each user with 50% discount of the first occasion</li>
                    </ul>
                    <button className="btn btn-black mt-auto" onClick={() => openModal('WhatsApp')}>Submit Request</button>
                  </div>
                </div>
              </div>

              {/* Weekly Newsletter Outreach */}
              <div className="col-md-4 card-container">
                <div className="card text-center d-flex flex-column shadow">
                <img src={newsletterOut} className="card-img-top-outreach" alt="Newsletter Outreach" />
                  <div className="card-body d-flex flex-grow-1 flex-column">
                    <h5 className="card-title">Weekly Newsletter</h5>
                    <ul className="text-start flex-grow-1">
                      <li>Featured in our popular weekly newsletter</li>
                      <li>Reach dedicated fashionistas</li>
                      <li>Highlight new arrivals and bestsellers</li>
                      <li>Perfect spotlight to reach </li>
                      <li>This is your entry to the big league</li>
                    </ul>
                    <button className="btn btn-black mt-auto" onClick={() => openModal('Newsletter')}>Submit Request</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {modalVisible && (
            <Modal
              title={`Submit Request for ${requestType}`}
              open={modalVisible}
              onOk={sendRequest}
              onCancel={closeModal}
              footer={[
                <Button key="back" onClick={closeModal}>Close</Button>,
                <Button key="submit" type="primary" className='modal-submit-btn' onClick={sendRequest}>Submit</Button>
              ]}
            >
              <p>Select the start date of the week you want to advertise:</p>
              <DatePicker
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                picker="date"
                disabledDate={disabledDate}
              />
              <p style={{marginTop: '1rem'}}>Selected Week: <strong>{displaySelectedWeek()}</strong></p>
              <Input 
                placeholder="Enter additional details here" 
                value={inputText} 
                onChange={handleInputChange} 
                style={{ marginTop: '1rem', width: '90%', marginBottom: '1rem'}}
              />
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Outreach;
