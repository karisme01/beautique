import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios'; // Make sure you have axios installed

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  // Function to fetch users based on the search query
  const fetchUsers = async (query) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/search-user?search=${query}`); 
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  // Initial fetch of users
  useEffect(() => {
    fetchUsers('');
  }, []);

  return (
    <Layout title={'Dashboard - All Users'}>
      <div className='container m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9' style={{width: '60%'}}>
            <h1>Users</h1>
            <input
              type="text"
              placeholder="Search Users..."
              value={search}
              onChange={handleSearchChange}
              className="form-control mb-3"
            />
            {/* Listing users in a table */}
            <div>
              {users.length > 0 ? (
                <table className="table table-striped" style={{width: '100%'}}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
