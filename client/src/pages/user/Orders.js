import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import '../../styles/Orders.css';
import { FaMoneyBillWave } from 'react-icons/fa'; 
import { InputNumber, Modal, Input} from 'antd';
import moment from 'moment';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [extendModalVisible, setExtendModalVisible] = useState(false);
  const [extensionDays, setExtensionDays] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [itemToReturn, setItemToReturn] = useState(null);

  const [auth] = useAuth();

  const fetchOrders = async () => {
    setLoading(true); 
    const userId = auth.user?._id;
    try {
      const { data } = await axios.get(`/api/v1/order/get-user-orders/${userId}`);
      let savings = 0;
      data.forEach(order => {
        order.items.forEach(item => {
          const retailPrice = item.product.price;
          const purchasePrice = (item.purchaseType === '0' ? retailPrice : 
                                 item.purchaseType === '1' ? 0.3 * retailPrice : 
                                 0.4 * retailPrice) * 
                                 (item.insured ? 1.10 : 1);
          savings += (retailPrice - purchasePrice);
        });
      });
      setTotalSavings(savings);
      setOrders(data); // Assuming the response structure includes the orders array
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [auth.user?._id]); // Added user._id as a dependency to refetch when it changes


  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderIds((currentExpandedOrderIds) =>
      currentExpandedOrderIds.includes(orderId)
        ? currentExpandedOrderIds.filter(id => id !== orderId)
        : [...currentExpandedOrderIds, orderId]
    );
  };

  const handleReturnClick = (item) => {
    setItemToReturn(item);
    setReturnModalVisible(true);
  };
  
  const handleReturnSubmit = async () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for the return.");
      return;
    }
    try {
      // API call to process return
      const response = await axios.post('/api/v1/order/update-order-item-return', {
        itemId: itemToReturn._id,
        reason: returnReason,
      }); 
      toast.success("Return processed successfully");
      setReturnModalVisible(false);
      setReturnReason('');
      fetchOrders();  
    } catch (error) {
      console.error("Error processing return:", error);
      toast.error("Failed to process return");
    }
  };
  
  const handleReturnCancel = () => {
    setReturnModalVisible(false);
    setReturnReason('');
  };
  

  const handleExtendClick = (item) => {
    if (item && !item.returned) {
      setSelectedItem(item);
      setExtensionDays(0);
      setExtendModalVisible(true);
    } else {
      console.error("Invalid item data or missing return date");
      toast.error("Unable to extend lease: Invalid item data");
    }
  };

  const handleOk = async () => {
    if (!selectedItem) {
      toast.error("No item selected for extension.");
      return;
    }
    if (selectedItem.extension && extensionDays <= selectedItem.extension) {
      toast.error(`Extension must be greater than the current ${selectedItem.extension} days.`);
      return;
    }
    const additionalDays = extensionDays - (selectedItem.extension || 0);
    const itemId = selectedItem._id;
    try {
      const response = await axios.patch(`/api/v1/order/update-order-item-extension`, {
        itemId,
        extensionDays,
      });
      toast.success(`Extension updated successfully. Charges applied for ${additionalDays} additional days.`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order extension:", error);
      toast.error("Failed to update order extension");
    }
    setExtendModalVisible(false);
  };

  const handleReturnLease = async (item, newStatus) => {
    try {
      const response = await axios.patch('/api/v1/order/update-order-item-status', {
        itemId: item._id,
        newStatus: newStatus,
      });
      if(response.data) {
        toast.success(`Status changed to ${newStatus} successfully`);
        fetchOrders();  // Re-fetch orders to reflect the updated status
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change status");
    }
};

  const handleCancel = () => {
    setExtendModalVisible(false);
  };

  return (
    <Layout title="Your Orders">
      <div className='container p-3 m-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9 order-layout'>
            {/* <h1>All Orders</h1> */}
            {loading ? (
              <p>Loading orders...</p>
            ) : orders?.length > 0 ? (
              <>
                {orders.map((order) => (
                  <div key={order?._id} style={{marginBottom: '20px', border: '1px solid #ddd', 
                    padding: '20px', borderRadius: '0px', width: '80%', backgroundColor: '#efefef'}}>
                    <div onClick={() => toggleOrderExpansion(order?._id)} className="order-header" 
                      style={{cursor: 'pointer', marginBottom: '20px'}}>
                      <div><strong>Order ID</strong>: {order?._id}</div>
                      <div><strong>Delivered to</strong>: {order?.userName}</div>
                      <div><strong>Order Status</strong>: {order?.status}</div>
                      <div><strong>Order Date</strong>: {new Date(order.createdAt).toISOString().split('T')[0]}</div>
                    </div>
                    {expandedOrderIds.includes(order._id) && (
                      <table className="table table-orders" style={{width: '100%'}}>
                        <thead>
                          <tr>
                            <th>Product Details</th>
                            <th>Purchase Details</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index}>  
                              <td>
                                {item.product ? (
                                  <div style={{display:'flex', flexDirection: 'row'}}>
                                      <img src={`/api/v1/product/product-photo/${item.product._id}`} alt={item.product.name} style={{ height: '170px', marginRight: '20px' }} />
                                      <div>
                                        <div>{item.product.name}</div>
                                        <div>Size: {item.size}</div>
                                        <div>Retail Price: {item.product.price}</div>
                                      </div>
                                  </div>
                                ) : <p>Product details not available</p>}
                              </td>
                              <td className='purchase-details'>
                                <div>{item.purchaseType === '0' ? 'Buy' : item.purchaseType === '1' ? '4-day lease' : '7-day lease'}</div>
                                <div>{item.insured ? 'Insured' : 'Not Insured'}</div>
                                <div>Order Item status: <strong>{item.status}</strong></div>
                                {((item.purchaseType === '1' || item.purchaseType === '2') && item.status === 'Collected') && (
                                    <div onClick={() => handleReturnLease(item, 'Lease Return Requested')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight:'bold'}}>
                                    Return Lease
                                  </div>
                                  
                                )}
                                <hr/>
                                {(item.status === 'Production' || item.status === 'Ship Requested') && (
                                    <div onClick={() => handleReturnLease(item, 'Cancelled')} className='mt-2' style={{ textDecoration: 'underline', cursor: 'pointer'}}>
                                      Cancel Order Item</div>
                                )}

                                {item.reserved && (
                                    <div>
                                      Reserved Date: <strong>{new Date(item.reserveDate).toISOString().split('T')[0]}</strong>
                                    </div>
                                )}
                                {(item.purchaseType === '0' && item.status === 'Collected') && (
                                    <div className='mt-2' style={{ textDecoration: 'underline', cursor: 'pointer'}}
                                    onClick={()=>handleReturnClick(item)}>Return purchase</div>
                                )}
                                {((item.purchaseType === '1' || item.purchaseType === '2') && !item.returned) && (
                                    <div className='mt-2' style={{ textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>handleExtendClick(item)}>Extend Leasing</div>
                                )}
                                {((item.purchaseType === '1' || item.purchaseType === '2') && !item.returned && item.extension != 0) && (
                                    <div onClick={()=>handleExtendClick(item)}>Extension applied - <strong>{item.extension} days</strong></div>
                                )}
                                {((item.purchaseType === '1' || item.purchaseType === '2') && item.status === 'Collected') && (
                                    <div className='mt-2' style={{cursor: 'pointer'}}>
                                      Lease end date: <strong>{new Date(item.leaseReturnDate).toISOString().split('T')[0]}</strong></div>
                                )}
                                {((item.purchaseType === '1' || item.purchaseType === '2') && item.status === 'Collected' && item.extension != 0) && (
                                  <div className='mt-2' style={{cursor: 'pointer'}}>
                                      Extended Lease end date: <strong>{
                                          (() => { 
                                              const returnDate = new Date(item.leaseReturnDate); // Convert leaseReturnDate to a Date object
                                              returnDate.setDate(returnDate.getDate() + item.extension); // Add extension days to the date
                                              return returnDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
                                          })()
                                      }</strong>
                                  </div>
                              )}

                                
                              </td>
                              <td>
                                {((item.purchaseType === '0' ? item.product.price : 
                                  item.purchaseType === '1' ? 0.3 * item.product.price : 
                                  0.4 * item.product.price) * 
                                  (item.insured ? 1.10 : 1)).toLocaleString("en-US", { style: "currency", currency: "INR" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
                <Modal
                  title="Extend Leasing"
                  open={extendModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  className="modal-custom"
                  okText="Apply Extension" 
                  cancelText="Cancel"
                  centered
                >
                  <p>How many additional days would you like to extend the lease beyond the current {selectedItem?.extension || 0} days?</p>
                  <InputNumber 
                    min={selectedItem && selectedItem.extension ? selectedItem.extension + 1 : 1} 
                    max={365} 
                    defaultValue={selectedItem?.extension || 0}
                    onChange={(value) => setExtensionDays(value)} 
                    style={{ width: '100%' }}
                  />
                  {selectedItem && selectedItem.extension > 0 && (
                    <p className="extension-info">
                      Current extension is {selectedItem.extension} days. Enter a total greater than this number.
                    </p>
                  )}
                  {extensionDays > (selectedItem?.extension || 0) && (
                    <p className="mt-3">Additional Extension Charges: <strong>Rs {(extensionDays - (selectedItem?.extension || 0)) * 200}</strong></p>
                  )}
                </Modal>

                <Modal
                  title="Return Item"
                  open={returnModalVisible}
                  onOk={handleReturnSubmit}
                  onCancel={handleReturnCancel}
                  okText="Submit Return"
                  cancelText="Cancel"
                >
                  <p>Please enter the reason for returning this item:</p>
                  <Input.TextArea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Enter reason here"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                  {itemToReturn && (
                    <p style={{ marginTop: '20px' }}>
                      Return is applicable till: {moment(itemToReturn.collectedDate).add(1, 'months').format('YYYY-MM-DD')}
                    </p>
                  )}
                </Modal> 

                <div className="total-savings">
                  <FaMoneyBillWave className="total-savings-icon" />
                  <strong>Total Savings: {totalSavings.toLocaleString("en-US", { style: "currency", currency: "INR" })}</strong>
                </div>
                {/* <h3>Total Savings: {totalSavings.toLocaleString("en-US", { style: "currency", currency: "INR" })}</h3> */}
              </>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
