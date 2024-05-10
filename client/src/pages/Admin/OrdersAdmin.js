import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  // Function to fetch orders based on the search query (orderId)
  const fetchOrders = async (query) => {
    try {
      const response = await axios.get(`/api/v1/admin/search-order?orderId=${query}`);
      setOrders(Array.isArray(response.data) ? response.data : [response.data]); // Ensure response is always an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Clear the orders if an error occurs
    }
  };

  // Handle the search input change and submit
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    fetchOrders(search);
  };

  // Fetch all orders initially or when the search query changes
  // useEffect(() => {
  //   fetchOrders(search);
  // }, [search]);

  return (
    <Layout title={'Dashboard - All Orders'}>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9' style={{ width: '700px'}}>
            <h1>Orders</h1> 
            <form onSubmit={handleSearchSubmit} className="d-flex mb-3">
            <input
              type="text"
              placeholder="Search Orders by ID..."
              value={search}
              onChange={handleSearchChange}
              className="form-control me-2" // 'me-2' adds a small margin to the right
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

            {/* Listing orders in a table */}
            {orders.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    {/* <th>User ID</th> */}
                    <th>User</th>
                    <th>Details</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      {/* <td>{order.userId ? order.userId : 'User ID not found'}</td> */}
                      <td>{order.userName ? order.userName : 'User not found'}</td>
                      <td>
                        Items: {order.items.length}
                        <br/>Status: {order.status}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))} 
                </tbody> 

              </table>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersAdmin;
