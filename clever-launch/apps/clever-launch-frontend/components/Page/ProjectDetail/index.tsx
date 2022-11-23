import { Grid, Progress } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import Section from '../../Common/AppSection';
import AppButton from '../../Common/AppButton';
import StoryProject from './Story';
import CommentProject from './Comment';
import { projectService } from '../../../services';
import AppImageLoader from '../../Common/AppImageLoader';
import dynamic from 'next/dynamic';
import { checkLinkVideo } from '../../../utils/checkLinkVideo';
import { getUrlVideo } from '../../../utils/getUrlVideo';
import UpdateProject from './UpdateProject';
import AppLoading from '../../Common/AppLoading';
import useWindowSize from '../../../hooks/useWindowSize';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import { formatProjectId } from 'apps/clever-launch-frontend/utils/formatProjectId';
import { useCleverLaunchContract } from 'apps/clever-launch-frontend/hooks/useContract';
import { useDispatch } from 'react-redux';
import {
  hideModalTx,
  showModalTx,
} from 'apps/clever-launch-frontend/store/slices/modalWaitingTx';
import { toast, ToastContainer } from 'react-toastify';
const AppPlayerVideo = dynamic(() => import('../../Common/AppPlayerVideo'), {
  ssr: false,
});
// eslint-disable-next-line @typescript-eslint/no-var-requires

const numeral = require('numeral');
function ProjectDetail() {
  const [activeTab, setActiveTab] = useState(1);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { account, chainId } = useWeb3React();
  const [scroll, setScroll] = useState(1);
  const { width } = useWindowSize();
  const router = useRouter();
  const { pid } = router.query as {
    pid?: string;
  };
  const dispatch = useDispatch();
  const contractCleverLaunch = useCleverLaunchContract(chainId);

  const route = useRouter();
  const [listTab] = useState([
    {
      tabId: 1,
      title: 'Story',
    },
    {
      tabId: 2,
      title: 'Update',
    },
    {
      tabId: 3,
      title: 'Comment',
    },
  ]);

  async function getProjectDetail() {
    try {
      setLoading(true);
      const rawProjectDetail = await projectService.getProjectDetail(
        pid as string
      );
      setProject(rawProjectDetail?.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const _projectId = formatProjectId(pid);

  const handleClaim = async () => {
    try {
      const params = [_projectId];
      const gasLimit = await contractCleverLaunch.estimateGas.claimFundCreator(
        ...params
      );
      const txClaim = await contractCleverLaunch.claimFundCreator(...params, {
        gasLimit,
      });

      dispatch(showModalTx('Transaction Processing....'));
      const txResult = await txClaim.wait(1);
      dispatch(hideModalTx());

      if (txResult?.status === 1) {
        toast.success('Claim Success !', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  useEffect(() => {
    getProjectDetail().then();
  }, [pid]);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className={'m-[200px] flex justify-center'}>
          <AppLoading />
        </div>
      ) : (
        <div>
          <Section>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} md={8}>
                <div className={'relative w-full'}>
                  {project?.introType === 'Image' ? (
                    <AppImageLoader url={project?.introUrl} />
                  ) : (
                    <iframe
                      width={'100%'}
                      height="100%"
                      src={project?.introUrl.replace('watch?v=', 'embed/')}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </Grid>
              <Grid xs={12} md={4}>
                <div className={'w-full'}>
                  <h2 className={'text-xl font-medium text-black'}>
                    {project?.title}
                  </h2>
                  <h4
                    className={
                      'text-base font-normal text-[#1F4690] mt-[10px] mb-[24px] cursor-pointer'
                    }
                    onClick={() =>
                      router.push({
                        pathname: '/profile/[wallet]',
                        query: {
                          wallet: `${project?.creatorId}`,
                          tab: Number(1),
                        },
                      })
                    }
                  >
                    {project?.creatorProfileName}
                  </h4>
                  <Progress
                    color="primary"
                    size="xs"
                    value={
                      Math.round(project?.fundedAmount / project?.fundingGoal) *
                      100
                    }
                  />
                  <h3
                    className={
                      'text-[28px] font-semibold text-[#1F4690] mt-[24px]'
                    }
                  >
                    {numeral(project?.fundedAmount).format('$0,0')}
                  </h3>
                  <h5 className={'text-base font-normal text-[#4D4D4D]'}>
                    donate of {numeral(project?.fundingGoal).format('$0,0')}{' '}
                    goal
                  </h5>
                  <h3
                    className={'text-[28px] font-semibold text-black mt-[24px]'}
                  >
                    {project?.backerCount} backers
                  </h3>
                  <h5
                    className={'text-base font-normal text-[#4D4D4D] mt-[24px]'}
                  >
                    {moment(project?.createdAt)
                      .add(project?.durationInDay, 'days')
                      .diff(moment(), 'days')}{' '}
                    days left
                  </h5>
                  <div className={'flex gap-2'}>
                    {project?.tags?.map((tag, index) => {
                      return (
                        <h4
                          key={index}
                          className={
                            'text-xs font-normal text-[#1F4690] mt-[16px]'
                          }
                        >
                          {tag.title}
                        </h4>
                      );
                    })}
                  </div>

                  <p
                    className={
                      'text-xs font-normal text-[#4D4D4D] mt-[38px] mb-[16px]'
                    }
                  >
                    All or nothing. This project will only be funded if it
                    reaches its goal by {project?.creatorProfileName},{' '}
                    {moment(project?.endAt).format(
                      'dddd, MMMM Do YYYY, h:mm:ss a'
                    )}
                    .
                  </p>
                  {width < 768 && (
                    <AppButton
                      onClick={() => setScroll(scroll + 1)}
                      bgCustom={'#E8AA42'}
                      css={{ width: '100%' }}
                    >
                      See option
                    </AppButton>
                  )}

                  {account == project?.creatorId && (
                    <AppButton
                      textColor={'white'}
                      bgCustom={'#1F4690'}
                      css={{ width: '100%', marginTop: 25 }}
                      onClick={() => handleClaim()}
                    >
                      Claim fund creator
                    </AppButton>
                  )}
                </div>
              </Grid>
            </Grid.Container>
          </Section>
          <div className="border-b" />
          <Section>
            <div className="flex justify-start items-center gap-[3px]">
              {listTab.map((item, index) => {
                return (
                  <button
                    key={index}
                    className={`py-[8px] px-[12px] ${
                      activeTab == item.tabId
                        ? 'bg-[#E4E7EC] text-[#1F4690] rounded-[6px]'
                        : ''
                    } text-[14px] font-normal text-[#4D4D4D]`}
                    onClick={() => setActiveTab(item.tabId)}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </Section>
          <div className="border-b" />
          {activeTab == 1 && <StoryProject scroll={scroll} />}
          {activeTab == 2 && <UpdateProject />}
          {activeTab == 3 && <CommentProject />}
        </div>
      )}
    </>
  );
}

export default ProjectDetail;
