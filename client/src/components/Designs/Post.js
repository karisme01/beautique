import React from 'react';

const Post = ({ imageSrc, link, caption }) => {
  return (
    <div style={{ margin: '0px', border: '0px solid #ccc', padding: '0px', borderRadius: '0px' }}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={imageSrc} alt={caption} style={{ width: '100%', height: 'auto', borderRadius: '20px' }} />
      </a>
      <p style={{ marginTop: '10px', fontSize: '16px', textAlign: 'center' }}>{caption}</p>
    </div>
  );
}

export default Post;


 
