import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'

const Dashboard = () => {
  const [auth] = useAuth()
  return (
    <Layout title={'User Dashboard'}>
        <div className='container-flui m-3 p-3'>
          <div className='row'>
            <div className='col-md-3'>
              <UserMenu/>
            </div>
            <div className='col-md-3'>
              <div className='card w-75 p-3'>
                {auth?.user?.name}
                {auth?.user?.email}
                {auth?.user?.address}
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default Dashboard
