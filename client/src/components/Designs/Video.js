import React from 'react';

function Video({ src }) {
  return (
    <video width="80%" controls>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default Video;
