import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { projectService } from '../../../../services';
import AppButton from '../../../Common/AppButton';
import UpdateProjectItem from '../../ProjectUpdateDetail/Components/UpdateProjectItem';
import Section from '../../../Common/AppSection';

function UpdateProject() {
  const router = useRouter();
  const { pid } = router.query;
  const [updates, setUpdate] = useState([]);

  useEffect(() => {
    getInformationUpdateProject().then();
  }, [pid]);

  async function getInformationUpdateProject() {
    try {
      const rawUpdateProject = await projectService.getUpdateProject(
        pid as string
      );
      setUpdate(rawUpdateProject?.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Section>
      {updates?.map((update, index) => {
        return (
          <UpdateProjectItem
            key={index}
            avatarUrl={update?.avatarUrl}
            content={update?.content}
            author={update?.creatorName}
            createdAt={update?.createdAt}
            projectUpdateNumber={update?.projectUpdateNumber}
          />
        );
      })}
    </Section>
  );
}

export default UpdateProject;
