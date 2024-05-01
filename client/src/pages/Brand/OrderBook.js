import React, {useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import BrandMenu from '../../components/Layout/BrandMenu'
import axios from 'axios'
import toast from 'react-hot-toast'

const OrderBook = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
      const response = await axios.get(`/api/v1/order/get-orders-brand/${auth.user?._id}`);
      setOrders(Array.isArray(response.data) ? response.data : [response.data]); // Ensure response is always an array
    } catch (error) { 
      console.error("Error fetching orders:", error);
      setOrders([]); // Clear the orders if an error occurs
    }
  };

  useEffect(() => {
      fetchOrders(); 
    }, []);

    const getStatusColor = (status, reserved) => {
        if (reserved) {
            return "lightblue"
        }
        switch (status) {
          case 'Production':
            return '#FFC1C3'; // Light warm red color code
          case 'Ship Requested':
            return '#FAC22D'
          case 'Shipped':
            return '#EEDC9A'; // Light yellow color code
          case 'Collected':
            return '#90EE90'; // Light green color code
          case 'Lease Return Requested':
            return '#19D1C0' 
          case 'Reverse Shipped':
            return "#B6834E"
          case 'Washing':
            return '#E09DFA'
          case 'Reverse Shipped 2':
            return '#F3F972'
          case 'Reverse Colleted':
            return '#ABF972'
          case 'Cancelled':
            return '#8E2DEE'
          case 'Processing Return':
            return "#A47CB8"
          case 'Returned':
            return '#8CAAA5'
          
          default:
            return 'none'; // No background color
        }
      };


  return (
    <Layout>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu/>
          </div>
        <div className='col-md-9 p-4 mt-3' style={{ width: '900px'}}>
            {/* Listing orders in a table */}
              <table className="table table-striped table-smaller-font">
                <thead>
                  <tr>
                    <th>Order ID</th>
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
                            disabled={order.status != 'Production'}
                            style={{cursor: order.status != 'Production' ? 'not-allowed' : 'pointer', }}
                        >
                            <option value="Production">Production</option>
                            <option value="Ship Requested">Request Ship</option>
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

export default OrderBook
