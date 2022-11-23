import { Avatar } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import Section from '../../Common/AppSection';
import About from './About';
import Backer from './Backer';
import ProjectUser from './ProjectUser';
import { useRouter } from 'next/router';
import { projectService, userService } from '../../../services';
import moment from 'moment';

function Profile() {
  const [activeTab, setActiveTab] = useState(1);
  const [totalProject, setTotalProject] = useState(0);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState<any>([]);
  const [backers, setBackers] = useState([]);
  const [loadingBacker, setLoadingBacker] = useState(false);
  const router = useRouter();
  const { wallet, tab } = router.query as { wallet?: string; tab?: string };

  const [listTab] = useState([
    {
      tabId: 1,
      title: 'About',
    },
    {
      tabId: 2,
      title: 'Backer',
    },
    {
      tabId: 3,
      title: 'Project',
    },
  ]);

  const getListProjectBacker = async () => {
    try {
      setLoadingBacker(true);
      const rawBacker = await projectService.getProjectBackerUser(wallet);
      setBackers(rawBacker.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingBacker(false);
    }
  };

  useEffect(() => {
    getProjectByUser().then();
    getProfileByWalletAddress().then();
    getListProjectBacker().then();
  }, [wallet]);

  useEffect(() => {
    tab && setActiveTab(Number(tab));
  }, [tab]);

  async function getProjectByUser() {
    try {
      const { data } = await projectService.getProjectByUser({ id: wallet });
      setProjects(data.data);
      setTotalProject(data?.data.length);
    } catch (e) {
      console.log(e);
    }
  }

  async function getProfileByWalletAddress() {
    try {
      const rawProfile = await userService.getProfileUserByWalletAddress(
        wallet
      );
      setProfile(rawProfile.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Section>
        <div className={'flex items-center'}>
          <div className={'w-[80px]'}>
            <Avatar
              src={`${
                profile?.avatarUrl || '../assets/icon/avatar-default.svg'
              }`}
              css={{ size: '$20', zIndex: 1 }}
            />
          </div>

          <div className={'ml-4'}>
            <h3
              onClick={() => console.log('test')}
              className={'text-base font-normal text-[#1F4690] mb-2'}
            >
              By {profile?.name || 'Default Name'}
            </h3>
            <h4 className={'text-[#B4B4B4] font-normal text-base'}>
              Backed {backers?.length || 0} projects · {profile?.city},{' '}
              {profile?.country} · Joined {` `}
              {profile?.createdAt &&
                moment(profile?.createdAt).format('dddd, MMMM Do YYYY')}
            </h4>
          </div>
        </div>
      </Section>
      <div className="border-b" />
      <Section>
        <div className="flex justify-start items-center gap-[3px]">
          {listTab.map((item, index) => {
            return (
              <div
                key={index}
                className={`py-[8px] px-[12px] relative ${
                  activeTab == item.tabId
                    ? 'bg-[#E4E7EC] text-[#1F4690] rounded-[6px]'
                    : ''
                } text-[14px] font-normal text-[#4D4D4D]`}
                onClick={() => {
                  router.push({
                    pathname: '/profile/[wallet]',
                    query: { wallet: `${wallet}`, tab: Number(item.tabId) },
                  });
                  setActiveTab(item.tabId);
                }}
              >
                {item.tabId === 3 && (
                  <div
                    className={
                      'absolute top-[-10px] right-[-3px] w-[20px] font-normal text-[12px] h-[20px] bg-[#1F4690] text-white text-center leading-[20px] rounded rounded-[50%]'
                    }
                  >
                    {totalProject}
                  </div>
                )}
                {item.title}
              </div>
            );
          })}
        </div>
      </Section>
      <div className="border-b" />
      {activeTab == 1 && <About profile={profile} />}
      {activeTab == 2 && <Backer projects={backers} />}
      {activeTab == 3 && <ProjectUser projects={projects} />}
    </div>
  );
}

export default Profile;
