const Card = ({ title, content, videoUrl, height }) => (
  <div style={{
    position: 'relative', // Essential for positioning the text over the video
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
      <>
        <video
          src={videoUrl}
          controls
          style={{
            height: '94%',
            maxWidth: '100%',
            alignSelf: 'center',
            objectFit: 'cover',
          }}
        />
      </>
    )}

    <div style={{
      position: 'absolute', // Positions the text over the video
      bottom: '0', // Aligns the text to the bottom of the video
      left: '0',
      width: '100%', // Ensures the text container spans the entire width of the video
      color: 'white', // Text color
      textAlign: 'left', // Centers the text horizontally
      padding: '10px 0', // Adds some padding inside the text container
      height: '35px',
      marginLeft: '9px',
      marginBottom: '5px'
    }}>
      {title}
    </div>
  </div>
  
);

export default Card;
