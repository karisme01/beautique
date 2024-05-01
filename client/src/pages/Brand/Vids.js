import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import BrandMenu from '../../components/Layout/BrandMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Vids.css'; 

const Vids = () => {
  const [video, setVideo] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [auth] = useAuth();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, [auth.user._id]); // Fetch videos whenever the user ID changes

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/brand/get-brand-videos/${auth.user._id}`);
      if (response.status === 200 && response.data) {
        setVideos(response.data);
      } else {
        toast.error('No videos found for this brand.');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Error fetching videos.');
    }
  };

 
  useEffect(() => {
    fetchProducts();
  }, [auth.user._id]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/brand/get-brand-products/${auth?.user._id}`);
      if (response.status === 200) {
        setProducts(response.data.products);
      } else {
        toast.error('No products found for this brand.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products.');
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) {
      toast.error("Please select a video to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('file', video);
    formData.append('userId', auth.user._id);

    try {
      const response = await axios.put(`/api/v1/brand/upload-video/${selectedProduct._id}`, formData);
      if (response.data.success) {
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video.');
    }
  };

  return (
    <Layout>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu/>
          </div>
          <div className='col-md-9'>
            <div className='container'>
              <h1>Brand Products</h1>
              <div className='table-responsive' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(products) && products.map((product) => (
                      <tr key={product._id} onClick={() => handleRowClick(product)}>
                        <td>{product.name}</td>
                        <td>{product._id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Selected Product: {selectedProduct?.name}</p>
            </div>
            <div className='p-4'>
              {/* <h1>Upload Video</h1> */}
              <input type="file" className='form-control' accept="video/*" onChange={handleFileChange} style={{width: '80%'}}/>
              <button onClick={handleUpload} className="btn btn-primary mt-2">
                <FontAwesomeIcon icon={faUpload} /> Upload Video
              </button>  
            </div>
            <div className='mt-4 m-4'>
            <h2>Your Videos</h2>
            <div className='row'> {/* Ensure this is a row for proper grid layout */}
            {videos.map((video, index) => (
                <div className='col-md-2 mb-2' key={index}>
                  <div style={{ width: '100%', position: 'relative', paddingBottom: '177.77%' /* 9:16 Aspect Ratio */, overflow: 'hidden' }}>
                    <video controls style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}>
                      <source src={video.videoUrl} type={video.contentType} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Vids;
