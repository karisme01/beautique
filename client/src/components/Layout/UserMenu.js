import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/UserMenu.css'

const UserMenu = () => {
  return (
    <div>
        <div className='text-center'>
            <div className="list-group">
                <h4>Dashboard</h4>
                <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action" activeClassName="active-link"> 
                    Profile
                </NavLink>
                <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action" activeClassName="active-link">
                    Orders
                </NavLink>
            </div>
        </div>
    </div>
  ) 
}



export default UserMenu


