import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../styles/RealTimeOrder.css'

const RealTimeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Function to fetch orders based on the search query (orderId)
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };


  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/v1/order/get-orders`);
      setOrders(Array.isArray(response.data) ? response.data : [response.data]); // Ensure response is always an array
    } catch (error) { 
      console.error("Error fetching orders:", error);
      setOrders([]); // Clear the orders if an error occurs
    }
  };

  useEffect(() => {
      fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
          case 'Production':
            return '#FFC1C3'; // Light warm red color code
          case 'Shipped':
            return '#EEDC9A'; // Light yellow color code
          case 'Collected':
            return '#90EE90'; // Light green color code
          default:
            return 'none'; // No background color
        }
      };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`/api/v1/order/update-order/${orderId}`, { status: newStatus });
            fetchOrders(); // Refresh orders to reflect the status update
            toast.success("Order status updated successfully");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
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
          <div className='col-md-9' style={{ width: '900px'}}>
            {/* Listing orders in a table */}
              <table className="table table-smaller-font">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    {/* <th>User ID</th> */}
                    <th>User</th>
                    <th>Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <React.Fragment key={order._id}>
                    <tr className="white-row" onClick={() => toggleOrderDetails(order._id)}
                        style={{ backgroundColor: getStatusColor(order.status) }}>
                        <td style={{cursor: 'pointer'}}>{order._id}</td>
                        <td style={{cursor: 'pointer'}}>{order.userName ? order.userName : 'User not found'}</td>
                        <td>

                        <strong>{order.status}</strong>
                        </td>
                        <td style={{cursor: 'pointer'}}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    {expandedOrderId === order._id && (
                        <tr>
                        <td colSpan="4">
                          <table className="table table-smaller-font">
                            <thead>
                              <tr>
                                <th>Product ID</th>
                                <th>Purchase Type</th>
                                <th>Size</th>
                                <th>Insured</th>
                                <th>Reserved</th>
                                <th>Status</th>
                                <th>Reserved Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.product}</td>
                                  <td>{['Buy', 'Half-weekly cycle', 'Full-weekly cycle'][item.purchaseType]}</td>
                                  <td>{item.size}</td>
                                  <td>{item.insured ? 'Yes' : 'No'}</td>
                                  <td>{item.reserved ? 'Yes' : 'No'}</td>
                                  <td>{item.status}</td>
                                  <td>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr> 
                    )}
                    </React.Fragment>
                ))}
                </tbody>


              </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RealTimeOrder;
