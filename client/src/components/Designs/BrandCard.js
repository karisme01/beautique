import React, { useState, useEffect } from 'react';
import { Button } from 'antd'; // Assuming you're using Ant Design for buttons
import '../../styles/BrandCard.css'; // Import CSS file for styling
import { FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';

const BrandCard = ({ brand }) => {
    const [auth] = useAuth()
    const [isFollowing, setIsFollowing] = useState(false); // State to manage follow/unfollow

    useEffect(() => {
        // Retrieve follow state from local storage
        const storedFollowState = localStorage.getItem(`followState_${auth.user._id}_${brand._id}`);
        if (storedFollowState !== null) {
            setIsFollowing(JSON.parse(storedFollowState));
        }
    }, [auth.user, brand._id]);

    const handleFollowToggle = async () => {
        try {
            const requestBody = { brandId: brand._id };
            await axios.post(`/api/v1/brand/update-following/${auth.user._id}`, requestBody);
            // Update local storage with the new follow state
            localStorage.setItem(`followState_${auth.user._id}_${brand._id}`, JSON.stringify(!isFollowing));
            // If successful, toggle the follow state locally
            toast.success('Following updated');
            setIsFollowing(prevState => !prevState);
        } catch (error) {
            console.error('Error updating following status:', error);
            // Handle error scenarios
        }
    };


  return (
    <div className="brand-card">
      <div className="brand-card-inner">
        <div className="brand-logo">
          <img className='brand-img' src={`/api/v1/brand/brand-photo/${brand._id}`} alt={brand.name} />
        </div>
        <div className="brand-details">
          <p>{brand.name}</p>
          <div className='follow-links'>
            <div>
                {isFollowing ? ( // Render the tick mark if following
                    <Button className={`follow-btn following`}>
                        Following <FaCheckCircle className="tick-icon"/> 
                    </Button>
                ) : (
                    <Button className={`follow-btn`} onClick={handleFollowToggle}>
                        Follow
                    </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
