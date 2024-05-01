import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/auth';
import BrandMenu from '../../components/Layout/BrandMenu';
import '../../styles/Analytics.css';
import axios from 'axios';

const Analytics = () => {
  const [auth] = useAuth();
  const [brandDetails, setBrandDetails] = useState(null);
  const [productTrends, setProductTrends] = useState({
    colorTrends: [],
    occasionTrends: [],
    materialTrends: [],
    categoryTrends: []
  });

  const fetchBrandDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/brand/get-brand-details/${auth.user?._id}`);
      if (response.data) {
        setBrandDetails([response.data]);
      }
    } catch (error) {
      console.error("Failed to fetch brand details:", error);
    }
  };

  const fetchProductTrends = async () => {
    try {
      const response = await axios.get('/api/v1/brand/get-product-trends');
      if (response.data && response.data.trends) {
        setProductTrends(response.data.trends);
      }
    } catch (error) {
      console.error("Failed to fetch product trends:", error);
    }
  };

  useEffect(() => { 
    fetchBrandDetails();
    fetchProductTrends();
  }, [auth.user?._id]);

  return (
    <Layout>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu/>
          </div>
          <div className='col-md-9'>
            
          <div className='row brand-details'>
            {brandDetails && (
              <>
                <div className='col-md-6 col-lg-4 mb-4 card-container'>
                  <div className='stat-card'>
                    <h4 className='text-center'>Total Units Sold</h4>
                    <p>{brandDetails[0].totalUnitsSold}</p>
                  </div>
                </div>
                <div className='col-md-6 col-lg-4 mb-4'>
                  <div className='stat-card'>
                    <h4 className='text-center'>Total Revenue Generated</h4>
                    <p>Rs {brandDetails[0].totalRevenue}</p>
                  </div>
                </div>
                <div className='col-md-6 col-lg-4 mb-4'>
                  <div className='stat-card'>
                    <h4 className='text-center'>Total Product Views</h4>
                    <p>2837</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <hr/>
          <div className='row p-4'>
            <div className="col-md-6">
              <h3>Category Trends</h3>
              <table className="table table-sm table-striped trend-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {productTrends[0]?.categoryTrends.map(trend => (
                    <tr key={trend._id}>
                      <td>{trend._id}</td>
                      <td>{trend.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Color Trends</h3>
              <table className="table table-sm table-striped trend-table">
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {productTrends[0]?.colorTrends.map(trend => (
                    <tr key={trend._id}>
                      <td>{trend._id}</td>
                      <td>{trend.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <h3>Occasion Trends</h3>
              <table className="table table-sm table-striped trend-table">
                <thead>
                  <tr>
                    <th>Occasion</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {productTrends[0]?.occasionTrends.map(trend => (
                    <tr key={trend._id}>
                      <td>{trend._id}</td>
                      <td>{trend.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Material Trends</h3>
              <table className="table table-sm table-striped trend-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {productTrends[0]?.materialTrends.map(trend => (
                    <tr key={trend._id}>
                      <td>{trend._id}</td>
                      <td>{trend.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
