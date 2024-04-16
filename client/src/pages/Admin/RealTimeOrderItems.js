import React, {useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminMenu from '../../components/Layout/AdminMenu'

const RealTimeOrderItem = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Function to fetch orders based on the search query (orderId)
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
        const response = await axios.patch(`/api/v1/order/update-order-item-status`, {
            itemId,
            newStatus,
        });
        fetchOrders(); // Refresh orders to reflect the status update
        toast.success("Order status updated successfully");
    } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
    }
};

const fetchOrders = async () => {
  try {
      // Construct the URL based on selected status
      let url = selectedStatus === 'All'
          ? `/api/v1/order/get-order-items`
          : `/api/v1/order/get-order-items-status/${selectedStatus}`;

      const response = await axios.get(url);
      setOrders(Array.isArray(response.data) ? response.data : [response.data]);
  } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Clear the orders if an error occurs
      toast.error("Failed to fetch orders");
  }
};


  useEffect(() => {
      fetchOrders(); 
    }, [selectedStatus]);

    const getStatusColor = (status, reserved) => {
        if (reserved) { 
            return "lightblue"
        }
        switch (status) {
          case 'Production':
            return '#FFC1C3'; // Light warm red color code
          case 'Shipped':
            return '#EEDC9A'; // Light yellow color code
          case 'Collected':
            return '#90EE90'; // Light green color code
          case 'Processing Return':
            return "#A47CB8"
          case 'Reverse Shipped':
            return "#B6834E" 
          default:
            return 'none'; // No background color
        }
      };


  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu/>
          </div>
        <div className='col-md-9' style={{ width: '900px'}}>
        <ul className="nav nav-tabs">
          {['All', 'Production', 'Shipped', 'Collected', 'Processing Return', 'Returned', 'Reverse Shipped'].map((status) => (
              <li className="nav-item" key={status}>
                  <a className={`nav-link ${selectedStatus === status ? 'active' : ''}`} href="#/" onClick={() => setSelectedStatus(status)}>
                      {status}
                  </a>
              </li>
          ))}
      </ul>

            {/* Listing orders in a table */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order Item ID</th>
                    {/* <th>User ID</th> */}
                    <th>User</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <React.Fragment key={order._id}>
                    <tr onClick={() => toggleOrderDetails(order._id)}
                        style={{ backgroundColor: getStatusColor(order.status, order.reserved) }}>
                        <td style={{cursor: 'pointer'}}>{order._id}</td>
                        <td style={{cursor: 'pointer'}}>{order.userId ? order.userId : 'User not found'}</td>
                        <td style={{cursor: 'pointer'}}>{order.status}</td>
                        <td>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="Production">Production</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Collected">Collected</option>
                            <option value="Reverse Shipped">Reverse Shipped</option>
                        </select>
                        </td>
                        <td style={{cursor: 'pointer'}}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                    {expandedOrderId === order._id && (
                        <tr>
                        <td colSpan="4">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Product ID</th>
                                <th>Purchase Type</th>
                                <th>Size</th>
                                <th>Insured</th>
                                <th>Reserved</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                             <tr>
                                <td>{order.product}</td>
                                <td>{['Buy', 'Half-weekly cycle', 'Full-weekly cycle'][order.purchaseType]}</td>
                                <td>{order.size}</td>
                                <td>{order.insured ? 'Yes' : 'No'}</td>
                                <td>{order.reserved ? 'Yes' : 'No'}</td>
                                <td>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                             </tr>
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
  )
}

export default RealTimeOrderItem
