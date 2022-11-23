import React from 'react';
import Section from '../../../Common/AppSection';
import CardProject from '../../../Common/AppCardProject';

interface IBacker {
  projects: any;
}

function Backer({ projects }: IBacker) {
  return (
    <Section>
      <div
        className={
          'flex flex-col md:flex-row gap-3 justify-between mt-[12px] md:mt-[32px]'
        }
      >
        {projects?.map((project, index) => {
          return (
            <CardProject
              type={project?.project?.introType}
              durationInDay={project?.project?.durationInDay || 0}
              id={project?.project.id}
              subTitle={project?.project.subTitle}
              key={index}
              author={`${project?.project.creatorFirstName} ${project?.project?.creatorLastName}`}
              createdAt={project?.createdAt}
              url={
                project?.project?.introUrl || `/assets/home/image-project.svg`
              }
              title={project?.project?.title}
              description={project?.project?.description}
              tags={project?.project?.tags}
              price={Number(project?.project?.fundedAmount) || 0}
              numberOfPledged={Number(project?.project?.fundingGoal) || 0}
            />
          );
        })}
      </div>
    </Section>
  );
}

export default Backer;
