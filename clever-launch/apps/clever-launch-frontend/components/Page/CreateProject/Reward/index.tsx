import ModalAddReward from '../Components/Modal/ModalAddReward';
import { IReward } from '..';
import RewardCard from '../Components/RewardCard';
import Section from '../../../Common/AppSection';
import { Grid } from '@nextui-org/react';
import {
  createReward,
  deleteReward,
  getReward,
} from 'apps/clever-launch-frontend/services/create-project';
import { useEffect, useState } from 'react';
import ButtonSubmit from '../Components/Button';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';

interface IRewardProps {
  projectId?: string;
  activeTab?: any;
  setActiveTab?: any;
  listYears?: any;
}

const SpinnerContainer = styled.div`
  img {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function Reward({ projectId, listYears }: IRewardProps): JSX.Element {
  const [isOpenReWard, setIsOpenReWard] = useState(false);
  const [listReward, setlistReward] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleRemoveReward = async (rewardId: number) => {
    try {
      const { status } = await deleteReward({
        rewardId,
        projectId,
      });
      if (status == 200 || status == 201) {
        handleGetReward();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetReward = async () => {
    try {
      const { data, status } = await getReward(projectId);
      if ((status == 200 || status == 201) && data) {
        setlistReward([...data]);
        setIsLoading(false);
        return;
      }
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleClickAddReward = () => {
    if (Array.from(listReward).length < 5) {
      setIsOpenReWard(true);
      return;
    } else {
      toast('You only can add 5 rewards');
    }
  };

  const handleRouter = () => {
    router.push({
      pathname: '/create-project/[id]',
      query: { id: `${projectId}`, tab: TABS.STORY },
    });
  };

  useEffect(() => {
    handleGetReward();
  }, []);

  return (
    <>
      <Section>
        <ToastContainer />
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} md={12}>
            <div className={'w-full'}>
              <p className="font-normal text-[18px] text-[#212121]">
                Add your rewards
              </p>

              <p className="font-normal text-[16px] text-[#4D4D4D] w-full md:w-[443px] mb-[34px] mt-[20px]">
                Offer simple, meaningful ways to bring backers closer to your
                project and celebrate it coming to life. Clever Launch supports
                up to 5 rewards.
              </p>
              <button
                disabled={Array.from(listReward)?.length >= 5}
                className={`cursor-pointer py-[8px] px-[14px] ${
                  Array.from(listReward)?.length >= 5
                    ? 'bg-[#B4B4B4] text-[#F9FAFB]'
                    : 'bg-[#E8AA42]'
                } rounded-[8px]`}
                onClick={handleClickAddReward}
              >
                Add New Reward
              </button>
            </div>
          </Grid>
        </Grid.Container>
      </Section>

      <div
        className="gap-[30px] w-full py-[40px]
       px-8 md:px-[109px] flex flex-col
       md:flex-row  md:flex-wrap"
      >
        {isLoading ? (
          <div className="w-full flex justify-center">
            <SpinnerContainer className="h-[48px] w-[48px] flex rounded-[50%] bg-[#212121] justify-center items-center ">
              <img
                src="/assets/create-project/processing.svg"
                alt="processingIcon"
              />
            </SpinnerContainer>
          </div>
        ) : Array.from(listReward).length != 0 ? (
          Array.from(listReward).map((item: IReward, index: number) => {
            return (
              <RewardCard
                key={index}
                handleRemoveReward={handleRemoveReward}
                item={item}
                setlistReward={setlistReward}
                listReward={listReward}
                handleGetReward={handleGetReward}
                listYears={listYears}
              />
            );
          })
        ) : (
          <div className="w-full flex gap-[20px]">
            <img src="/assets/create-project/cry.svg" alt="" />
            <div>
              <p className="text-[18px] font-normal text-[#212121] mb-[8px]">
                You have no reward
              </p>
              <p className="text-[#B4B4B4] font-normal text-[16px] ">
                Offer something in return of what the backers want. ex: Special
                thanks, exclusive items.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="md:mb-[85px]">
        <ButtonSubmit onClick={() => handleRouter()} />
      </div>

      <ModalAddReward
        visible={isOpenReWard}
        closeHandler={() => setIsOpenReWard(false)}
        handleGetReward={handleGetReward}
        projectId={projectId}
        setIsOpenReWard={setIsOpenReWard}
        listYears={listYears}
      />
    </>
  );
}

export default Reward;
