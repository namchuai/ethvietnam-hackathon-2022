import ProjectList from 'apps/clever-launch-frontend/components/Page/ProjectList';
import Layout from '../../components/Common/AppLayout';
export function Project() {
  return (
    <div>
      <Layout pageTitle={'Home Page'} mainContent={<ProjectList />} />
    </div>
  );
}

export default Project;
