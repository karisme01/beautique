import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/auth';
import BrandMenu from '../../components/Layout/BrandMenu';

const BrandProducts = () => {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/brand/get-brand-products/${auth.user._id}`);
      setProducts(response?.data?.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    if (auth.user._id) {
      fetchProducts();
    }
  }, [auth.user._id]);

  const showModal = (product) => {
    setSelectedProduct(product); // Set the selected product
    setIsModalVisible(true); // Show the modal
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <Layout>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu/>
          </div>
          <div className='col-md-9 p-4 mt-3'>
            <div className='card w-75 p-3 border-0'>
              <h4>Products</h4>
              {products?.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Price</th>
                    </tr> 
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} onClick={() => showModal(product)} style={{cursor: 'pointer'}}>
                        <td>{product.name}</td>
                        <td>Rs {product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No products found</p>
              )}
              <Modal 
                title="Product Details" 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                footer={null}
                width={700} // Adjust the width for better layout
                >
                {selectedProduct && (
                    <div>
                    <h3>{selectedProduct.name}</h3>
                    <hr/>
                    <p><strong>Price:</strong> Rs {selectedProduct.price}</p>
                    <hr/>
                    <p><strong>Category:</strong> {selectedProduct.category}</p>
                    <hr/>
                    <p><strong>Color:</strong> {selectedProduct.color}</p>
                    <hr/>
                    {selectedProduct.occasion && <p><strong>Occasion:</strong> {selectedProduct.occasion}</p>}
                    <hr/>
                    <p><strong>Lease:</strong> {selectedProduct.rent ? "Available for Lease" : "Not Available for Lease"}</p>
                    </div>
                )}
                </Modal>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrandProducts;
