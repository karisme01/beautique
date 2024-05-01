import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/UserMenu.css'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'

const UserMenu = () => {
    const [auth, setAuth] = useAuth();
    const handleLogout = () => {
        setAuth({ user: null, token: '' });
        localStorage.removeItem('auth');
        toast.success('Logged out successfully');
        };
  return (
    <div>
        <div className='text-center'>
            <div className="list-group">
                <h4>Dashboard</h4>
                <NavLink 
                    to="/dashboard/user/profile" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Profile
                </NavLink>
                <NavLink 
                    to="/dashboard/user/orders" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Orders
                </NavLink>
                <NavLink 
                    to="/dashboard/user/address-book" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Address Book
                </NavLink>
                <NavLink 
                    to="/dashboard/user/messages" 
                    className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'}>
                    Send A Message
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'list-group-item list-group-item-action active-link' : 'list-group-item list-group-item-action'} onClick={handleLogout}>
                    Logout
                </NavLink>
            </div>
        </div>
    </div>
  ) 
}



export default UserMenu


