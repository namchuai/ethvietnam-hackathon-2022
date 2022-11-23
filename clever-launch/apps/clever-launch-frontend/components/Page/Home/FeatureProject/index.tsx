import React, { useState, useEffect } from 'react';
import CardProject from '../../../Common/AppCardProject';
import Section from '../../../Common/AppSection';
import { projectService } from '../../../../services';
import { Project } from '@clever-launch/data';

function FeatureProject() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getListProjectFeatured().then();
  }, []);

  async function getListProjectFeatured() {
    try {
      const rawProject = await projectService.getFeaturedProjects({ limit: 3 });
      setProjects(rawProject?.data?.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Section>
      <span className={'text-base font-normal text-[#1F4690]'}>
        Featured Projects
      </span>
      <div
        className={
          'flex flex-col md:flex-row gap-3 justify-between mt-[12px] md:mt-[32px]'
        }
      >
        {projects?.map((project, index) => {
          return (
            <CardProject
              key={index}
              type={project?.introType}
              id={project?.id}
              durationInDay={project?.durationInDay || 0}
              author={`${project?.creatorFirstName} ${project?.creatorLastName}`}
              subTitle={project.subTitle}
              createdAt={project?.createdAt}
              url={project?.introUrl || `/assets/home/image-project.svg`}
              title={project?.title}
              description={project?.subTitle}
              tags={project?.tags}
              price={Number(project?.fundedAmount) || 0}
              numberOfPledged={Number(project?.fundingGoal) || 0}
            />
          );
        })}
      </div>
    </Section>
  );
}

export default FeatureProject;
