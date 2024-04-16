import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { Modal, Button, Select } from 'antd';

const Register = () => {
  // Basic registration data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(0); // Default to 'Join As User'
  const [address, setAddress] = useState([{
    street: '',
    city: '',
    state: '',
    zipCode: ''
  }]);
  const [answer, setAnswer] = useState(""); // e.g., answer to a security question

  // Preferences
  const [preferredOccasions, setPreferredOccasions] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [preferredColors, setPreferredColors] = useState([]);
  const [preferredMaterials, setPreferredMaterials] = useState([]);
  const [preferredPriceRanges, setPreferredPriceRanges] = useState([]);

  // Modal control
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();

  // Option arrays for checkboxes in the modal
  const occasionsOptions = ["Wedding", "Casual", "Party", "Formal", "Festival"];
  const categoryOptions = ["Indowestern Wear", "Kurtis & Tunics", "Sari"];
  const colorOptions = ["Red", "Yellow", "Green", "Blue", "Black", "White", "Gold", "Brown"];
  const materialOptions = ["Cotton", "Silk", "Wool", "Leather", "Chiffon", "Nylon"];
  const priceRangeOptions = [
    "0 - 1,000", "1,000 - 5,000", "5,000 - 10,000", "10,000 - 20,000", "Above 20,000"
  ];

  const handleCheckboxChange = (value, setter, currentValues) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  useEffect(() => {
    console.log(address);
  }, [address]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => {
      // If there's no address, create the first object
      if (prevAddress.length === 0) {
        return [{ [name]: value }];
      } else {
        // Otherwise, update the first address object
        const firstAddress = { ...prevAddress[0], [name]: value };
        return [firstAddress];
      }
    });
  };

  const handlePriceRangeChange = (priceRange) => {
        setPreferredPriceRanges((currentRanges) => {
          if (currentRanges.includes(priceRange)) {
            return currentRanges.filter((range) => range !== priceRange);
          } else {
            return [...currentRanges, priceRange];
          }
        });
      };

      const handleOccasionChange = (occasion) => {
        setPreferredOccasions((currentOccasions) => {
          if (currentOccasions.includes(occasion)) {
            return currentOccasions.filter((o) => o !== occasion);
          } else {
            return [...currentOccasions, occasion];
          }
        });
      };
    
    
      const handleCategoryChange = (category) => {
        const updatedCategories = preferredCategories.includes(category)
          ? preferredCategories.filter((c) => c !== category)
          : [...preferredCategories, category];
        setPreferredCategories(updatedCategories);
      };
      
      const handleColorChange = (color) => {
        const updatedColors = preferredColors.includes(color)
          ? preferredColors.filter((c) => c !== color)
          : [...preferredColors, color];
        setPreferredColors(updatedColors);
      };
      
      const handleMaterialChange = (material) => {
        const updatedMaterials = preferredMaterials.includes(material)
          ? preferredMaterials.filter((m) => m !== material)
          : [...preferredMaterials, material];
        setPreferredMaterials(updatedMaterials);
      };
      

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can validate the initial form data if needed
    setIsModalVisible(true); // Show the modal for additional preferences
  };

  const handleFinalSubmit = async () => {
    setIsModalVisible(false); // Close the modal
    try {
      const response = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
        preferredCategories,
        preferredColors,
        preferredMaterials,
        preferredOccasions,
        preferredPriceRanges,
        role
      });

      if (response.data.success) {
        toast.success("Registration successful");
        navigate("/login"); // Redirect to login page upon successful registration
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error(error);
    }
  };

  // Render the form and the modal
  return (
    <Layout title="Register - Karisme">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit} style={{ width: '400px', margin: '50px auto' }}>
          {/* Registration form fields here */}
          <h4 className="title">REGISTER FORM</h4>
          {/* Example input field */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter Your Name"
              required
            />
          </div>
          {/* More fields for email, password, etc. */}
          <div className="" style={{marginBottom: '30px'}}>
               <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="" style={{marginBottom: '30px'}}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="" style={{marginBottom: '30px'}}>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={address.street}
              onChange={handleAddressChange}
              name="street"
              className="form-control"
              placeholder="Street"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={address.city}
              onChange={handleAddressChange}
              name="city"
              className="form-control"
              placeholder="City"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={address.state}
              onChange={handleAddressChange}
              name="state"
              className="form-control"
              placeholder="State"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={address.zipCode}
              onChange={handleAddressChange}
              name="zipCode"
              className="form-control"
              placeholder="Zip Code"
              required
            />
          </div>
          <div className="" style={{marginBottom: '30px'}}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Your Birthplace"
              required
            />
          </div>
          <div style={{ marginBottom: '30px', marginTop: '40px'}}>
          <Select
            defaultValue={role}
            style={{ width: '100%' }}
            onChange={(value) => setRole(value)}
          >
            <Select.Option value={0}>Join As User</Select.Option>
            <Select.Option value={2}>Join As Brand</Select.Option>
          </Select>
        </div>
          
          <button type="submit" className="btn btn-primary" style={{marginLeft: '7px', width: '350px'}}>Next</button>
          <div className="text-center"
            style={{cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', marginTop: '30px', marginBottom: '-15px'}} 
            onClick={()=>navigate('/login')} >
            Already have an account? Login here
          </div>
        </form>

        
      </div>

      {/* Preferences Modal */}
      <Modal
        title="Preferences"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Remove default buttons
        centered
        style={{ maxHeight: '120vh', overflowY: 'auto', top: 20 }}
      >
        {/* Example of handling occasions */}
        <div className="preference-container" style={{
          display: 'flex', flexWrap: 'wrap', maxHeight: '200px', overflow: 'auto'
        }}>
        <div className="preference-group">
            <label className="preference-label">Preferred Occasions:</label>
            <div className="form-check" style={{marginLeft: '0px'}}>
              {occasionsOptions.map((occasion) => (
                <div key={occasion} className="">
                  <input
                    type="checkbox"
                    id={`occasion-${occasion}`}
                    className="form-check-input"
                    value={occasion}
                    onChange={() => handleOccasionChange(occasion)}
                    checked={preferredOccasions.includes(occasion)}
                  />
                  <label htmlFor={`occasions-${occasion}`} className="form-check-label">
                    {occasion}
                  </label>
                </div>
              ))}
            </div>
          </div>

        <div className="preference-group">
              <label className="preference-label">Preferred Categories:</label>
              <div className="form-check" style={{marginLeft: '0px'}}>
              {categoryOptions.map((category) => (
            <div key={category} className="">
              <input
                type="checkbox"
                id={`category-${category}`}
                className="form-check-input"
                value={category}
                onChange={() => handleCategoryChange(category)}
                checked={preferredCategories.includes(category)}
              />
              <div style={{width: '20px'}}/>
              <label htmlFor={`category-${category}`} className="form-check-label">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

          <div className="preference-group">
            <label className="preference-label">Preferred Colors:</label>
            <div className="form-check" style={{marginLeft: '0px'}}>
              {colorOptions.map((color) => (
                <div key={color} className="">
                  <input
                    type="checkbox"
                    id={`color-${color}`}
                    className="form-check-input"
                    value={color}
                    onChange={() => handleColorChange(color)}
                    checked={preferredColors.includes(color)}
                  />
                  <label htmlFor={`color-${color}`} className="form-check-label">
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </div>

           <div className="preference-group">
            <label className="preference-label">Preferred Materials:</label>
            <div className="form-check" style={{marginLeft: '0px'}}>
              {materialOptions.map((material) => (
                <div key={material} className="">
                  <input
                    type="checkbox"
                    id={`material-${material}`}
                    className="form-check-input"
                    value={material}
                    onChange={() => handleMaterialChange(material)}
                    checked={preferredMaterials.includes(material)}
                  />
                  <label htmlFor={`material-${material}`} className="form-check-label">
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="preference-label">Preferred Price Ranges:</label>
            {priceRangeOptions.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={option}
                  value={option}
                  checked={preferredPriceRanges.includes(option)}
                  onChange={() => handlePriceRangeChange(option)}
                />
                <label className="form-check-label" htmlFor={option}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          </div>
        {/* Implement other preferences similarly */}
        {/* Custom submit button */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button style={{backgroundColor: 'black', color: 'white'}} onClick={handleFinalSubmit}>Submit Registration</Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Register;



