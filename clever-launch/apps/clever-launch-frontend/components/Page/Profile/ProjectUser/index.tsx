import React, { useState, useEffect } from 'react';
import AppProjectManageItem from '../../../Common/AppProjectManageItem';
import Section from '../../../Common/AppSection';
import { projectService } from '../../../../services';
import { useRouter } from 'next/router';

interface IProjectUser {
  projects: any;
}

function ProjectUser({ projects }: IProjectUser) {
  return (
    <Section>
      {projects?.map((project, index) => {
        return <AppProjectManageItem key={index} project={project} />;
      })}
    </Section>
  );
}

export default ProjectUser;
