import { Grid, Row } from '@nextui-org/react';
import React, { useState, useEffect, useRef } from 'react';
import Section from '../../../Common/AppSection';
import AppButton from '../../../Common/AppButton';
import { useRouter } from 'next/router';
import { createProjectService, projectService } from '../../../../services';
import * as DOMPurify from 'dompurify';
import { actionMapName } from '../../CreateProject/Components/Modal/ModalAddReward';

const scrollToRef = (ref) =>
  window.scrollTo({ top: ref.current.offsetTop - 100, behavior: 'smooth' });

interface IStory {
  scroll?: any;
}

function StoryProject({ scroll }: IStory) {
  const router = useRouter();
  const { pid } = router.query;
  const sectionRef = useRef(null);
  const [story, setStory] = useState(null);
  const [rewards, setRewards] = useState([]);

  const executeSectionScroll = () => scrollToRef(sectionRef);

  useEffect(() => {
    scroll && scroll !== 1 && executeSectionScroll();
  }, [scroll]);

  async function getStoryProject() {
    try {
      const rawStory = await projectService.getStoryProject(pid as string);
      setStory(rawStory.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function getRewardByProject() {
    try {
      const rawReward = await createProjectService.getReward(pid as string);
      setRewards(rawReward?.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getStoryProject().then();
    getRewardByProject().then();
  }, [pid]);

  console.log(story, 'story');

  return (
    <Section>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={8}>
          <div className={'flex flex-col w-full'}>
            {' '}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(story?.story),
              }}
            />
          </div>
        </Grid>
        <Grid xs={12} md={4}>
          <div className={'w-full flex flex-col'}>
            <h3 className={'text-[20px] font-medium text-black'}>
              Support options
            </h3>
            <div className="mt-[16px]">
              <div className="w-full p-[24px]  border border-[#E4E7EC] rounded-[8px]">
                <h4 className="text-start mb-[10px]">Donate without rewards</h4>
                <AppButton
                  textColor={'white'}
                  bgCustom={'#1F4690'}
                  css={{ width: '100%' }}
                  onClick={() =>
                    router.push({
                      pathname: '/without/[pid]',
                      query: { pid },
                    })
                  }
                >
                  Donate
                </AppButton>
              </div>
            </div>
            <div ref={sectionRef} className="mt-[16px]">
              {rewards?.map((reward, index) => {
                return (
                  <div
                    key={index}
                    className="w-full p-[24px]  border border-[#E4E7EC] rounded-[8px] mt-[16px]"
                  >
                    <p className="text-start">
                      Donate {reward?.price} USDT or more
                    </p>
                    <p className="text-start  text-[18px] font-semibold text-[#212121] my-[20px]">
                      {reward?.title}
                    </p>

                    <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                      ESTIMATE DELIVERY:
                    </p>
                    <p className="text-start text-[16px] font-normal text-[#4D4D4D] mb-[20px]">
                      {actionMapName[reward.estDeliveryMonth]}{' '}
                      {reward.estDeliveryYear}
                    </p>
                    {reward?.rewardType !== 'Digital' && (
                      <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                        COUNTRY SUPPORT DELIVERY:
                      </p>
                    )}

                    {reward?.rewardType !== 'Digital' && (
                      <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                        {' '}
                        {reward.deliveryNote}
                      </p>
                    )}
                    <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-2 break-words">
                      {`Limited (${reward?.amountLeft} left of ${reward?.totalAmount})`}
                    </p>
                    <button
                      onClick={() =>
                        router.push({
                          pathname: '/payment/[rid]',
                          query: {
                            rid: reward?.id,
                            projectId: pid,
                          },
                        })
                      }
                      className="w-full py-[12px] text-white px-[20px] text-[16px] font-normal bg-[#1F4690] mt-[24px] rounded-[8px]"
                    >
                      Donate {reward?.price}$ or more
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
      </Grid.Container>
    </Section>
  );
}

export default StoryProject;
