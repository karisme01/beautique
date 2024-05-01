import React from 'react'
import { NavLink } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'

const AdminMenu = () => {
    const [auth, setAuth] = useAuth();
    const handleLogout = () => {
        setAuth({ user: null, token: '' });
        localStorage.removeItem('auth');
        toast.success('Logged out successfully');
        };
  return (
    <>
        <div className='text-center'>
            <div className="list-group">
                <h4>Admin Panel</h4>
                <NavLink 
                    to="/dashboard/admin/create-category" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Create Category
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/create-product" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Create Product
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/products" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Products
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/create-brand" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Create Brand
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/users" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Users
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/orders" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Orders
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-orders" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Real Time Orders
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-order-items" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Real Time Order Items
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'} onClick={handleLogout}>
                    Logout
                </NavLink>
                {/* <NavLink 
                    to="/dashboard/admin/real-time-order-items-production" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Production
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-order-items-shipped" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Shipped
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-order-items-collected" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Collected
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-order-items-processing-return" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Processing Return
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/real-time-order-items-returned" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Returned
                </NavLink> */}
            </div>
        </div>
    </>
  )
}

export default AdminMenu
