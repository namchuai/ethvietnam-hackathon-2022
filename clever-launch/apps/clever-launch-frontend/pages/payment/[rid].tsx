import React from 'react';
import Layout from '../../components/Common/AppLayout';
import Payment from '../../components/Page/Payment';

function PaymentPage() {
  return (
    <div>
      <Layout pageTitle={'Payment'} mainContent={<Payment />} />
    </div>
  );
}

export default PaymentPage;
