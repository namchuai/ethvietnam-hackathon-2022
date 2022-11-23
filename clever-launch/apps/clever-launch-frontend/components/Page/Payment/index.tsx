import { Grid } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import Section from '../../Common/AppSection';
import AppInput from '../../Common/AppInput';
import useMobile from 'apps/clever-launch-frontend/hooks/useMobile';
import AppButton from '../../Common/AppButton';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { createProjectService, transactionService } from '../../../services';
import { toast, ToastContainer } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { showModalConnect } from '../../../store/slices/modalConnectSlice';
import { useDispatch } from 'react-redux';
import { actionMapName } from '../CreateProject/Components/Modal/ModalAddReward';
import { formatProjectId } from 'apps/clever-launch-frontend/utils/formatProjectId';
import {
  useCleverLaunchContract,
  useERC20Contract,
} from 'apps/clever-launch-frontend/hooks/useContract';
import {
  CLEVER_ADDRESS,
  MAX_UINT256,
} from 'apps/clever-launch-frontend/assets/address';
import {
  hideModalTx,
  showModalTx,
} from 'apps/clever-launch-frontend/store/slices/modalWaitingTx';

const schema = yup.object().shape({
  amount: yup.number().transform((value) => (isNaN(value) ? undefined : value)),
});

function Payment() {
  const isMobile = useMobile();
  const router = useRouter();
  const { rid, projectId } = router.query as {
    rid?: string;
    projectId?: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
  });
  const dispatch = useDispatch();
  const { account, chainId } = useWeb3React();
  const [reward, setReward] = useState(null);
  const contractCLT = useERC20Contract(chainId);
  const contractCleverLaunch = useCleverLaunchContract(chainId);
  const _projectId = formatProjectId(projectId);

  async function getRewardDetail() {
    try {
      const rawReward = await createProjectService.getRewardDetail(rid);
      setReward(rawReward.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function onSubmit(data) {
    try {
      if (!account || !localStorage.getItem('access_token')) {
        dispatch(showModalConnect());
        return;
      }

      const txAppove = await contractCLT.approve(
        CLEVER_ADDRESS[chainId],
        MAX_UINT256
      );
      dispatch(showModalTx('Approving...'));
      await txAppove.wait(1);
      dispatch(hideModalTx());

      const params = [
        _projectId,
        isNaN(data.amount)
          ? parseEther(String(Number(reward?.price)))
          : parseEther(String(Number(reward?.price) + Number(data.amount))),
      ];

      const gasLimit = await contractCleverLaunch.estimateGas.deposit(
        ...params
      );
      const txDeposit = await contractCleverLaunch.deposit(...params, {
        gasLimit,
      });
      dispatch(showModalTx('Transaction Processing....'));
      const txResult = await txDeposit.wait(1);
      dispatch(hideModalTx());

      if (txResult?.status === 1) {
        toast.success('Deposit Success !', {
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

      if (txResult?.transactionHash) {
        const dataDonate = {
          ...data,
          rewardId: rid,
          projectId,
          amount: isNaN(data.amount)
            ? Number(reward?.price)
            : Number(reward?.price) + Number(data.amount),
        };

        const { status } = await transactionService.postDonateReward({
          ...dataDonate,
          transactionHash: txResult.transactionHash,
        });

        if (status == 200 || status == 201) {
          toast.success('Donate Success !', {
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
  }

  useEffect(() => {
    getRewardDetail().then();
  }, [rid]);

  return (
    <div>
      <ToastContainer />
      <form onSubmit={() => handleSubmit(onSubmit)}>
        <Section>
          <div className="text-[36px] font-semibold">Payment</div>
        </Section>
        <div className="border-b" />
        <div className="mb-[50px]">
          <Section>
            <Grid.Container gap={2} justify="flex-start">
              <Grid xs={12} md={4}>
                <div className={'w-full'}>
                  <div className="w-full p-[24px]  border border-[#E4E7EC] rounded-[8px] mt-[16px]">
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
                      {actionMapName[reward?.estDeliveryMonth]}{' '}
                      {reward?.estDeliveryYear}
                    </p>
                    {reward?.rewardType !== 'Digital' && (
                      <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                        COUNTRY SUPPORT DELIVERY:
                      </p>
                    )}

                    {reward?.rewardType !== 'Digital' && (
                      <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                        {' '}
                        {reward?.deliveryNote}
                      </p>
                    )}
                    <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-2 break-words">
                      {`Limited (${reward?.amountLeft} left of ${reward?.totalAmount})`}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid xs={12} md={8}>
                <div className={'w-full md:w-auto'}>
                  <AppInput
                    label="Bonus support for Project owner (Optional)"
                    fullWidth={isMobile}
                    width={`${!isMobile && '485px'}`}
                    name={'amount'}
                    placeholder="Enter amount"
                    register={register('amount')}
                    helperText={`${
                      errors?.amount?.message
                        ? 'amount day must be a number type and min value 1'
                        : ''
                    }`}
                    color={`${errors?.amount?.message ? 'error' : 'default'}`}
                    defaultValue={''}
                    contentRight={
                      <div className="flex">
                        <span>|</span>{' '}
                        <span className="ml-[8px] text-[16px]">USDT</span>
                      </div>
                    }
                    css={{
                      '& .nextui-c-PJLV-dBGXHd-applyStyles-true': {
                        marginRight: '35px',
                      },
                    }}
                  />
                  <p className="flex justify-end font-normal text-[#B4B4B4] text-[12px] mt-[6px]">
                    1 USDT ~ 1 USD
                  </p>
                  <AppButton
                    onClick={handleSubmit(onSubmit)}
                    bgCustom={'#E8AA42'}
                  >
                    Donate{' '}
                    {isNaN(watch('amount'))
                      ? Number(reward?.price)
                      : Number(reward?.price) + Number(watch('amount') || 0)}
                    {` `}USDT
                  </AppButton>
                </div>
              </Grid>
            </Grid.Container>
          </Section>
        </div>
      </form>
    </div>
  );
}

export default Payment;
