// import React from 'react'
// import Layout from '../../components/Layout/Layout'
// import UserMenu from '../../components/Layout/UserMenu'
// import { useAuth } from '../../context/auth'

// const Dashboard = () => {
//   const [auth] = useAuth()
//   return (
//     <Layout title={'User Dashboard'}>
//         <div className='container-flui m-3 p-3'>
//           <div className='row'>
//             <div className='col-md-3'>
//               <UserMenu/>
//             </div>
//             <div className='col-md-3'>
//               <div className='card w-75 p-3'>
//                 {auth?.user?.name}
//                 {auth?.user?.email}
//                 {auth?.user?.address}
//               </div>
//             </div>
//           </div>
//         </div>
//     </Layout>
//   )
// }

// export default Dashboard

import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={'User Dashboard'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-lg-3 col-md-4 col-sm-12'>
            <UserMenu />
          </div>
          <div className='col-lg-9 col-md-8 col-sm-12'>
            <div className='card w-100 p-3'>
              <div className='card-body'>
                <h5 className='card-title'>Welcome, {auth?.user?.name}!</h5>
                <p className='card-text'><strong>Email:</strong> {auth?.user?.email}</p>
                <p className='card-text'><strong>Address:</strong> {auth?.user?.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard;
