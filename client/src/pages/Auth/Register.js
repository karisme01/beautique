import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [preferredOccasions, setPreferredOccasions] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [preferredColors, setPreferredColors] = useState([]);
  const [preferredMaterials, setPreferredMaterials] = useState([]);
  const [preferredPriceRanges, setPreferredPriceRanges] = useState([]);



  const navigate = useNavigate();
  const occasionsOptions = ["Wedding", "Casual", "Party", "Formal", "Festival"];
  const categoryOptions = ["Indowestern Wear", "Kurtis & Tunics", "Sari"];
  const colorOptions = ["Red", "Yellow", "Green", "Blue", "Black", "White", "Gold", "Brown"];
  const materialOptions = ["Cotton", "Silk", "Wool", "Leather", "Chiffon", "Nylon"];
  const priceRangeOptions = [
    { label: "0 - 1,000", value: "priceRange1" },
    { label: "1,000 - 5,000", value: "priceRange2" },
    { label: "5,000 - 10,000", value: "priceRange3" },
    { label: "10,000 - 20,000", value: "priceRange4" },
    { label: "Above 20,000", value: "priceRange5" }
  ];
  

  useEffect(() => {
    console.log(preferredCategories, preferredColors, preferredMaterials, preferredOccasions, preferredPriceRanges)
  }, [preferredCategories, preferredColors, preferredMaterials, preferredOccasions, preferredPriceRanges]);

  const handleOccasionChange = (occasion) => {
    const updatedOccasions = preferredOccasions.includes(occasion)
      ? preferredOccasions.filter((c) => c !== occasion)
      : [...preferredOccasions, occasion];
    setPreferredOccasions(updatedOccasions);
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
  

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
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
        preferredPriceRanges
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Register - Karisme">
      <div className="form-container" style={{ minHeight: "90vh", display: 'flex', flexDirection: 'row'}}>
        <form style={{width: '500px', marginLeft: '-100px'}} onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="" style={{marginBottom: '30px'}}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
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
          <div className="" style={{marginBottom: '30px'}}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
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
          {/* <button type="submit" className="btn btn-primary">
            REGISTER
          </button> */}
        </form>

        <form style={{width: '700px', marginLeft: '50px'}} onSubmit={handleSubmit}>
          <h4 className="title">PREFERENCES</h4>


          <div className="preference-group">
            <label className="preference-label">Preferred Occasions:</label>
            <div className="form-check">
              {occasionsOptions.map((occasion) => (
                <div key={occasion}>
                  <input
                    type="checkbox"
                    id={`occasion-${occasion}`}
                    className="form-check-input"
                    value={occasion}
                    onChange={() => handleOccasionChange(occasion)}
                    checked={preferredOccasions.includes(occasion)}
                  />
                  <label htmlFor={`occasion-${occasion}`} className="form-check-label">
                    {occasion}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="preference-group">
            <label className="preference-label">Preferred Categories:</label>
            <div className="form-check">
              {categoryOptions.map((category) => (
                <div key={category}>
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    className="form-check-input"
                    value={category}
                    onChange={() => handleCategoryChange(category)}
                    checked={preferredCategories.includes(category)}
                  />
                  <label htmlFor={`category-${category}`} className="form-check-label">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

        <div className="preference-group">
            <label className="preference-label">Preferred Colors:</label>
            <div className="form-check">
              {colorOptions.map((color) => (
                <div key={color}>
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
            <div className="form-check">
              {materialOptions.map((material) => (
                <div key={material}>
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
            <label className="form-label">Preferred Price Ranges:</label>
            {priceRangeOptions.map((option) => (
              <div key={option.value} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={option.value}
                  value={option.value}
                  checked={preferredPriceRanges.includes(option.value)}
                  onChange={() => handlePriceRangeChange(option.value)}
                />
                <label className="form-check-label" htmlFor={option.value}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>


          

        <button type="submit" className="btn btn-primary">
          REGISTER
        </button>
      </form>
      </div>



      
    </Layout>
  );
};

export default Register;


