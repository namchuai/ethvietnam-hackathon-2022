import ProjectDetail from 'apps/clever-launch-frontend/components/Page/ProjectDetail';
import Layout from '../../components/Common/AppLayout';
export function ProjectDetailInfo() {
  return (
    <div>
      <Layout pageTitle={'Home Page'} mainContent={<ProjectDetail />} />
    </div>
  );
}

export default ProjectDetailInfo;
