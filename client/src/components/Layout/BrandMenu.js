import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import '../../styles/BrandMenu.css'

const BrandMenu = () => {
  const [ordersInProduction, setOrdersInProduction] = useState(0);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Fixed useAuth usage

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/v1/order/get-orders-brand/${auth?.user?._id}`);
      const fetchedOrders = Array.isArray(response.data) ? response.data : [response.data];
      setOrders(fetchedOrders);
      
      // Calculate productionOrdersCount after orders are fetched and set
      const productionOrdersCount = fetchedOrders.filter(order => order.status === 'Production').length;
      setOrdersInProduction(productionOrdersCount);

    } catch (error) {
      console.error("Error fetching orders:", error);   
      setOrders([]);
      setOrdersInProduction(0); // Reset to 0 if there's an error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [auth?.user?._id]);

  return (
    <>
        <div className='text-center'>
            <div className="list-group">
                <h4>Brand Panel</h4>
                <NavLink 
                    to="/dashboard/brand/profileBrand" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Brand Profile
                </NavLink>
                <NavLink 
                    to="/dashboard/brand/record-order" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Record Order
                </NavLink>
                <NavLink 
                    to="/dashboard/brand/products" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Products
                </NavLink>
                <NavLink 
                    to="/dashboard/brand/order-book" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Order Book {ordersInProduction > 0 && <span className="badge">{ordersInProduction}</span>}
                </NavLink>
                <NavLink 
                    to="/dashboard/brand/outreach" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Outreach
                </NavLink>

            </div>
        </div>
    </>
  );
}

export default BrandMenu;
