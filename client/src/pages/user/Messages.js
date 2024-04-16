import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../styles/Messages.css'
import { useNavigate } from 'react-router-dom';


const faqData = [
    {
      question: "How does clothing leasing work?",
      answer: "Clothing leasing allows you to rent clothes for a predetermined period instead of buying them. This is cost-effective and environmentally friendly as it promotes clothing reuse."
    },
    {
      question: "What are the leasing terms?",
      answer: "Leasing terms typically range from a few days to several months, depending on your needs. We offer flexible options to suit different occasions and durations."
    },
    {
      question: "How do I return the leased clothes?",
      answer: "Once the lease period is over, you can return the clothes using the prepaid shipping label provided. Make sure the clothes are in good condition."
    },
    {
      question: "What if I want to buy the clothes I leased?",
      answer: "If you fall in love with an item, you can purchase it at a discounted price after the leasing period ends. This option is available for most items."
    }
  ];

  const FAQItem = ({ faq, toggleFAQ, isOpen }) => (
    <>
      <tr onClick={toggleFAQ} className="faq-question-row">
        <td>{faq.question}</td>
      </tr>
      {isOpen && (
        <tr className="faq-answer-row">
          <td>{faq.answer}</td>
        </tr>
      )}
    </>
  );
  
  const Messages = () => {
    const [auth] = useAuth();
    const [message, setMessage] = useState('');
    const [openFAQIndex, setOpenFAQIndex] = useState(-1); // -1 means no FAQ is open
    const navigate = useNavigate()

    const handleFAQToggle = index => {
      setOpenFAQIndex(openFAQIndex === index ? -1 : index); // Toggle behavior
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!message) {
        toast.error("Please enter a message.");
        return;
      }
      try {
        await axios.post('/api/v1/messages/create-send-message', {
          userId: auth.user._id, 
          text: message
        });
        toast.success('Message sent successfully!');
        setMessage(''); 
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message.');
      }
    };
  
    return (
      <Layout title={'User Dashboard'}>
        <div className='container-fluid m-3 p-3'>
          <div className='row'>
            <div className='col-lg-3 col-md-4 col-sm-12'>
              <UserMenu />
            </div>
            <div className='col-lg-9 col-md-8 col-sm-12'>
              <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                  <label htmlFor="messageText" className="form-label">Message:</label>
                  <textarea
                    className="form-control message-textarea"
                    id="messageText"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <button type="submit" className="btn send-btn">Send Message</button>
              </form>

              <div className='contact-link' onClick={() => navigate('../../Contact')}>
                Click here to go to Contact page
              </div>

              <table className="faq-table">
                <tbody>
                  {faqData.map((faq, index) => (
                    <FAQItem
                      key={index}
                      faq={faq}
                      isOpen={openFAQIndex === index}
                      toggleFAQ={() => handleFAQToggle(index)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default Messages;
  