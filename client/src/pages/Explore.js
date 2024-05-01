import React from 'react';
import Layout from '../components/Layout/Layout';
import VideoList from '../components/Designs/VideoList';  // Make sure the path is correct

const Explore = () => {
  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto'}}>
        <VideoList />
      </div>
    </Layout>
  );
};

export default Explore;
