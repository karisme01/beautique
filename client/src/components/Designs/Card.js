// import React, { useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLink } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';

// const Card = ({ title, content, videoUrl, height }) => {
//   const navigate = useNavigate();
//   const videoRef = useRef(null); // Reference to the video element

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(entry => {
//           // Check if the video is visible and has a src attribute
//           if (entry.isIntersecting && videoRef.current && videoUrl) {
//             videoRef.current.play();
//           } else if (videoRef.current) {
//             videoRef.current.pause();
//           }
//         });
//       },
//       {
//         root: null, // Observing for viewport
//         rootMargin: '0px',
//         threshold: 0.5 // Trigger when at least 50% of the video is visible
//       }
//     );

//     if (videoRef.current) {
//       observer.observe(videoRef.current);
//     }

//     return () => {
//       if (videoRef.current) {
//         observer.unobserve(videoRef.current);
//       }
//     };
//   }, [videoUrl]); // Effect dependencies

//   return (
//     <div style={{
//       position: 'relative', 
//       height: height,
//       minWidth: '300px',
//       margin: '10px',
//       background: '#000000',
//       borderRadius: '8px', 
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//       cursor: 'pointer',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//     }}>
//       {videoUrl && (
//         <video
//           ref={videoRef}
//           src={videoUrl}
//           controls
//           muted
//           loop
//           style={{
//             height: '94%',
//             maxWidth: '100%',
//             alignSelf: 'center',
//             objectFit: 'cover', 
//           }}
//         />
//       )}

//       <div style={{
//         position: 'absolute', 
//         bottom: '-10px', 
//         left: '0',
//         right: '0', 
//         color: 'white', 
//         display: 'flex',
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         padding: '10px',
//       }}>
//         <span>{title}</span>
//         <FontAwesomeIcon icon={faLink} title="Go to this product" onClick={() => navigate('/product/White-Wear')} />
//       </div>
//     </div>
//   );
// };

// export default Card;

import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import HeartIconToggle from './HeartIconToggle'; // Ensure you have the correct path to the HeartIconToggle component

const Card = ({ title, content, videoUrl, height }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference to the video element
  const [isLiked, setIsLiked] = useState(false); // State to track if the video is liked

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Check if the video is visible and has a src attribute
          if (entry.isIntersecting && videoRef.current && videoUrl) {
            videoRef.current.play();
          } else if (videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      {
        root: null, // Observing for viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when at least 50% of the video is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoUrl]); // Effect dependencies

  const toggleLike = () => {
    setIsLiked(!isLiked); // Toggle the like state
  };

  return (
    <div style={{
      position: 'relative', 
      height: height,
      minWidth: '300px',
      margin: '10px',
      background: '#000000',
      borderRadius: '8px', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          muted
          loop
          style={{
            height: '92%',
            maxWidth: '100%',
            alignSelf: 'center',
            objectFit: 'cover', 
          }}
        />
      )}

      <div style={{
        position: 'absolute', 
        bottom: '-10px', 
        left: '0',
        right: '0', 
        color: 'white', 
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '10px',
      }}>
        <span>{title}</span>
        {/* <div style={{marginLeft: '100px'}}>
          <HeartIconToggle isFilled={isLiked} onToggle={toggleLike}/>
        </div> */}
        <FontAwesomeIcon icon={faLink} title="Go to this product" onClick={() => navigate('/product/White-Wear')} />
      </div>
    </div>
  );
};

export default Card;
