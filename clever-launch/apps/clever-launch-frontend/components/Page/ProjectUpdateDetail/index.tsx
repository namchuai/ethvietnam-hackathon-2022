import { Avatar, Grid } from '@nextui-org/react';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  getProjectDetail,
  getStoryProject,
  getUpdateProject,
  updateProject,
} from 'apps/clever-launch-frontend/services/project';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppButton from '../../Common/AppButton';
import Section from '../../Common/AppSection';
import { ToastContainer } from 'react-toastify';
import UpdateProjectItem from './Components/UpdateProjectItem';
import ModalProjectUpdate from './Components/ModalUpdateProject';
import { checkLinkVideo } from '../../../utils/checkLinkVideo';
import dynamic from 'next/dynamic';

const AppPlayerVideo = dynamic(() => import('../../Common/AppPlayerVideo'), {
  ssr: false,
});

interface Idata {
  creatorId?: string;
  id?: string;
  title?: string;
  subTitle?: string;
  introType?: string;
  introUrl?: string;
  fundRaisingMethod?: string;
  fundingGoal?: string;
  durationInDay?: number;
  pitchDeckUrl?: string;
  tags?: Array<any>;
  walletAddress?: string;
  contactEmail?: string;
  updatedAt?: number;
  createdAt?: number;
  status?: string;
  featuredPoint?: number;
  fundedAmount?: string;
  backerCount?: number;
  creatorFirstName?: string;
  creatorLastName?: string;
  creatorProfileName?: string;
}

const ProjectUpdate = (): JSX.Element => {
  const route = useRouter();
  const [data, setData] = useState<Idata>({});
  const [listUpdate, setListUpdate] = useState<any>([]);
  const [isShow, setIsShow] = useState(false);

  const { pid } = route.query as { pid?: string };

  const getDetailProject = async () => {
    try {
      const { data, status } = await getProjectDetail(pid);
      if ((status == 201 || status == 200) && data) {
        setData({ ...data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetListUpdateProject = async () => {
    const { data, status } = await getUpdateProject(pid);
    if ((status == 201 || status == 200) && data) {
      setListUpdate(data);
    }
  };

  console.log(`listUpdate`, listUpdate);

  useEffect(() => {
    getDetailProject();
    handleGetListUpdateProject();
  }, []);

  useEffect(() => {
    handleGetListUpdateProject();
  }, [isShow]);

  return (
    <>
      <ToastContainer />
      <Section>
        <div
          className={
            'flex flex-col md:flex-row md:w-full max-w-[800px] mt-[40px]'
          }
        >
          {data?.introType === 'Image' ? (
            <img
              className="rounded-[12px] w-[384px] h-[219px] object-cover"
              src={data?.introUrl}
              alt=""
            />
          ) : (
            <div className={'h-[219px]'}>
              <AppPlayerVideo
                type={
                  data?.introUrl && checkLinkVideo(data?.introUrl)
                    ? 'youtube'
                    : 'mp4'
                }
                url={data?.introUrl}
              />
            </div>
          )}
          <div
            className={
              'flex flex-col justify-between ml-0 md:ml-6 mt-4 md:mt-0'
            }
          >
            <div className={'mb-[20px]'}>
              <h3 className={'text-black font-semibold text-[20px] mb-[20px]'}>
                {data?.title}
              </h3>
              <p className={'text-[#4D4D4D] text-base font-normal'}>
                {data?.subTitle}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-b" />

      <Section>
        <div
          className={`py-[8px] px-[12px]
            text-[#1F4690]  bg-[#E4E7EC] rounded-[6px] w-fit
           text-[14px] font-normal`}
        >
          Update
        </div>
      </Section>

      <div className="border-b" />

      <Section>
        <div className="pl-[12px]">
          <AppButton
            bgCustom={'#E8AA42'}
            css={{ width: '200px' }}
            onClick={() => setIsShow(true)}
          >
            Add New Update
          </AppButton>
        </div>

        {listUpdate?.map((update, index) => {
          return (
            <UpdateProjectItem
              key={index}
              avatarUrl={update.avatarUrl}
              content={update.content}
              author={update?.creatorName}
              createdAt={update.createdAt}
              projectUpdateNumber={update.projectUpdateNumber}
            />
          );
        })}
      </Section>
      <ModalProjectUpdate
        visible={isShow}
        closeHandler={() => setIsShow(false)}
      />
    </>
  );
};

export default ProjectUpdate;
