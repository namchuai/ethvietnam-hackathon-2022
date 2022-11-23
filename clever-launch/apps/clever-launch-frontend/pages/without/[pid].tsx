import React from 'react';
import Layout from '../../components/Common/AppLayout';
import WithOut from '../../components/Page/WithOut';

function WithOutPage() {
  return (
    <div>
      <Layout pageTitle={'Payment'} mainContent={<WithOut />} />
    </div>
  );
}

export default WithOutPage;
