// Card.js
const Card2 = ({ title, content, image, onClick }) => (
    <div onClick={onClick} className='shadow-lg' style={{
      height: '300px',
      minWidth: '300px', // Adjusted width
      margin: '10px',
      background: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    }}>
      <img src={image} alt={title} style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    
    }} />
      <p>{title}</p>
      <div >
      {/* <p className="text-center">{content}</p> */}
      </div>
    </div>
  );


  
  export default Card2;
  