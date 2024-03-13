import React, { useState, useEffect } from 'react';
import '../styles/BrandList.css'; // Import the CSS file
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    const getAllBrand = async () => {
        try {
          const { data } = await axios.get("/api/v1/brand/get-brand");
          if (data?.success) {
            setBrands(data?.brand);
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong in getting brands");
        }
      };

      useEffect(() => {

        getAllBrand()
      }, []);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBrandClick = (brandSlug) => {
        navigate(`/cloud-brands/${brandSlug}`);
    };

    return (
        <div className='cover'>
            <Layout>
                <div className="brand-list-container">
                    <h1 className="brand-list-title">Shop By Designer Brands</h1>
                    <input 
                        type="text" 
                        placeholder="Search brands..." 
                        value={searchTerm} 
                        onChange={handleSearchChange}
                        className="brand-search-input"
                    />
                    <div className="brand-list">
                        {filteredBrands.map(brand => (
                            <div key={brand._id} className="brand-item" onClick={() => handleBrandClick(brand.slug)}>{brand.name} </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default BrandList;
