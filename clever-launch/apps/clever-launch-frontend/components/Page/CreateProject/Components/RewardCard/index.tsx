import { updateReward } from 'apps/clever-launch-frontend/services/create-project';
import { shortenSting } from 'apps/clever-launch-frontend/utils/subString';
import { useState, useEffect } from 'react';
import { IReward } from '../..';
import ModalAddReward from '../Modal/ModalAddReward';

interface RewardCardProps {
  item: any;
  handleRemoveReward?: any;
  setlistReward?: any;
  listReward?: any;
  handleGetReward?: any;
  listYears?: any;
}

const RewardCard = ({
  handleRemoveReward,
  item,
  handleGetReward,
  listYears,
}: RewardCardProps): JSX.Element => {
  const [isOpenReWard, setIsOpenReWard] = useState(false);
  const [rewardItem, setRewardItem] = useState(item);

  useEffect(() => {
    setRewardItem(item);
  }, [item]);

  return (
    <>
      <div className="w-full md:w-[384px] h-[121px] p-[24px] border border-[#E4E7EC] rounded-[8px] flex-col">
        <div className="flex justify-between w-full">
          <div className={'text-xs md:text-base'}>
            Donate {item.price} USDT or more
          </div>
          <div className="flex gap-[21px]">
            <img
              src="/assets/create-project/edit.svg"
              alt="edit-icon"
              className="cursor-pointer w-[15px] md:w-auto"
              onClick={() => setIsOpenReWard(true)}
            />
            <img
              className="cursor-pointer w-[15px] md:w-auto"
              src="/assets/create-project/trash.svg"
              alt="edit-icon"
              onClick={() => handleRemoveReward(item.id)}
            />
          </div>
        </div>
        <div className="text-xs md:text-base mt-[28px]">
          {shortenSting(item.title)}
        </div>
      </div>
      <ModalAddReward
        type={'edit'}
        id={item.id}
        rewardItem={rewardItem}
        visible={isOpenReWard}
        setIsOpenReWard={setIsOpenReWard}
        handleGetReward={handleGetReward}
        closeHandler={() => setIsOpenReWard(false)}
        listYears={listYears}
      />
    </>
  );
};

export default RewardCard;
