import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import BrandMenu from '../../components/Layout/BrandMenu'

const BrandDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <BrandMenu/>
          </div>
          <div className='col-md-9'>
            <div className='card w-75 p-3'>
              <h3> Brand Name: {auth?.user?.name} </h3>
              <h3> Brand Email: {auth?.user?.email} </h3>
              <h3> Brand Contact: {auth?.user?.phone} </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BrandDashboard
