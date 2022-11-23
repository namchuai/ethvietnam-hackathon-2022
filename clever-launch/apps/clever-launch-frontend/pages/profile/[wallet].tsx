import React from 'react';
import Layout from '../../components/Common/AppLayout';
import Profile from '../../components/Page/Profile';

function ProfilePage() {
  return (
    <div>
      <Layout pageTitle={'Payment'} mainContent={<Profile />} />
    </div>
  );
}

export default ProfilePage;
