import React, { useState, useEffect } from 'react';
import Section from '../../Common/AppSection';
import FilterProject from './FilterProject';
import CardProject from '../../Common/AppCardProject';
import InfiniteScroll from 'react-infinite-scroll-component';
import { projectService } from '../../../services';
import { Loading } from '@nextui-org/react';
import AppLoading from '../../Common/AppLoading';

function ProjectList() {
  const [listTag] = useState<Array<any>>([
    {
      id: 1,
      title: 'Game',
    },
    {
      id: 2,
      title: 'Art',
    },
    {
      id: 3,
      title: 'Comic & illustration',
    },

    {
      id: 4,
      title: 'Design & Tech',
    },
    {
      id: 5,
      title: 'Social Media',
    },
    {
      id: 6,
      title: 'Charity',
    },
  ]);
  const [listTagSelected, setListTagSelected] = useState<Array<any>>([]);
  const [projects, setProjects] = useState(Array.from({ length: 0 }));
  const [limitValue, setLimit] = useState<any>(12);
  const [sortTypeValue, setSorType] = useState<any>('newest_first');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(true);
  const [loading, setLoading] = useState(false);

  const [idTagArr, setIdTagArr] = useState([]);

  const [isShow, setIsShow] = useState<boolean>(false);

  const remove = (index: number, id: number) => {
    const newArrTagSelected = [...listTagSelected];
    newArrTagSelected.splice(index, 1);
    setListTagSelected([...newArrTagSelected]);
    const newArrId = [...idTagArr];
    const newResult = newArrId.filter((item) => item != id);
    setIdTagArr([...newResult]);
  };

  const handleApply = () => {
    const result = idTagArr.map((id) => {
      return listTag.find((item) => item.id == id);
    });
    setIsShow(false);
    const final = new Set([...listTagSelected, ...result]);
    setListTagSelected([...final]);
  };

  function fetchMoreData() {
    setTimeout(() => {
      setLimit(Number(limitValue) + 12);
    }, 1500);
  }

  useEffect(() => {
    getListProject().then();
  }, [limitValue, sortTypeValue]);

  async function getListProject() {
    try {
      setLoading(true);
      const rawProject = await projectService.getProject({
        limit: limitValue,
        sortType: sortTypeValue,
      });
      setProjects(rawProject?.data?.data);
      setLastEvaluatedKey(!!rawProject?.data?.lastEvaluatedKey || false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSortProject(value) {
    setSorType(value);
  }

  return (
    <Section>
      <FilterProject
        listTagSelected={listTagSelected}
        setIsShow={setIsShow}
        setIdTagArr={setIdTagArr}
        listTag={listTag}
        idTagArr={idTagArr}
        isShow={isShow}
        remove={remove}
        setListTagSelected={listTagSelected}
        handleApply={handleApply}
        sortType={sortTypeValue}
        setSortType={handleSortProject}
      />

      <InfiniteScroll
        dataLength={projects.length}
        next={fetchMoreData}
        hasMore={!loading}
        style={{
          width: '100%',
        }}
        loader={!loading && lastEvaluatedKey && <Loading />}
      >
        <div
          className={
            'grid grid-cols-1 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-3 mt-[12px] md:mt-[32px]'
          }
        >
          {projects?.map((project: any, index) => {
            return (
              <CardProject
                type={project?.introType}
                durationInDay={project?.durationInDay || 0}
                id={project?.id}
                subTitle={project?.subTitle}
                key={index}
                author={`${project?.creatorFirstName} ${project?.creatorLastName}`}
                createdAt={project?.createdAt}
                url={project?.introUrl || `/assets/home/image-project.svg`}
                title={project?.title}
                description={project?.description}
                tags={project?.tags}
                price={Number(project?.fundedAmount) || 0}
                numberOfPledged={Number(project?.fundingGoal) || 0}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </Section>
  );
}

export default ProjectList;
