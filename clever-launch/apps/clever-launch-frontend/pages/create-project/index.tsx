import Layout from 'apps/clever-launch-frontend/components/Common/AppLayout';
import CreateProject from 'apps/clever-launch-frontend/components/Page/CreateProject';

function Creation() {
  return (
    <div>
      <Layout
        pageTitle={'Home Page'}
        mainContent={<CreateProject />}
        isShortenFooter={true}
      />
    </div>
  );
}

export default Creation;
