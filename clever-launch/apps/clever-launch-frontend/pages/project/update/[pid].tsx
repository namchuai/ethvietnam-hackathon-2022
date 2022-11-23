import Layout from 'apps/clever-launch-frontend/components/Common/AppLayout';
import ProjectUpdate from 'apps/clever-launch-frontend/components/Page/ProjectUpdateDetail';

export function ProjectDetailInfo() {
  return (
    <div>
      <Layout
        pageTitle={'Home Page'}
        mainContent={<ProjectUpdate />}
        isShortenFooter={true}
      />
    </div>
  );
}

export default ProjectDetailInfo;
