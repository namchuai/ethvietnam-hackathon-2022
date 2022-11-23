import Layout from '../components/Common/AppLayout';
import Home from '../components/Page/Home';

export function Index() {
  return (
    <div>
      <Layout pageTitle={'Home Page'} mainContent={<Home />} />
    </div>
  );
}

export default Index;
