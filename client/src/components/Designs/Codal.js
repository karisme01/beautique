import React, {useState} from "react";

const Codal = ({ isOpen, onClose, onConfirm, product }) => {
    const [selectedSize, setSelectedSize] = useState('');
  
    if (!isOpen) return null;
  
    return (
      <div className="">
        <div className="modal-content"> 
          <h2>Select Size</h2>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">Select a size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
          <button onClick={() => onConfirm(product, selectedSize)}>Add to Cart</button>
          <button onClick={onClose}>X</button>
        </div>
      </div>
    );
  }

export default Codal