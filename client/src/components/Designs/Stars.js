import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStarOfDavid } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = Math.floor(5 - rating);

  return (
    <div>
      {[...Array(fullStars)].map((star, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon={faStar} style={{ color: '#FFC000', fontSize: '14px' }} />
      ))}
      {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: '#ffc107' }} />}
      {[...Array(emptyStars)].map((star, index) => (
        <FontAwesomeIcon key={`empty-${index}`} icon={faStar} style={{ color: '#e4e5e9', fontSize: '10px'  }} />
      ))}
    </div>
  );
};

export default StarRating;
