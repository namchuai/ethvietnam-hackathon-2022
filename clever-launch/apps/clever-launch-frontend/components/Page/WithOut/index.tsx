import { Grid } from '@nextui-org/react';
import React, { useState } from 'react';
import Section from '../../Common/AppSection';
import AppInput from '../../Common/AppInput';
import useMobile from 'apps/clever-launch-frontend/hooks/useMobile';
import AppButton from '../../Common/AppButton';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { showModalConnect } from '../../../store/slices/modalConnectSlice';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useDispatch } from 'react-redux';
import {
  useCleverLaunchContract,
  useERC20Contract,
} from 'apps/clever-launch-frontend/hooks/useContract';
import {
  CLEVER_ADDRESS,
  MAX_UINT256,
} from 'apps/clever-launch-frontend/assets/address';
import { formatProjectId } from 'apps/clever-launch-frontend/utils/formatProjectId';
import {
  hideModalTx,
  showModalTx,
} from 'apps/clever-launch-frontend/store/slices/modalWaitingTx';
import { transactionService } from '../../../services';

const schema = yup.object().shape({
  amount: yup.number().min(1).required('amount is required'),
});

declare global {
  interface Window {
    ethereum: any;
  }
}

function WithOut() {
  const isMobile = useMobile();
  const { account, chainId } = useWeb3React();
  const router = useRouter();
  const { rid, pid } = router.query as {
    rid?: string;
    pid?: string;
  };
  const dispatch = useDispatch();
  const contractCLT = useERC20Contract(chainId);
  const contractCleverLaunch = useCleverLaunchContract(chainId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
  });
  const _projectId = formatProjectId(pid);
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

      const params = [_projectId, parseEther(data.amount.toString())];
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
        const dataDonate = {
          ...data,
          projectId: pid,
          amount: Number(data.amount),
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

        return;
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
      dispatch(hideModalTx());
      if (e?.code === 'ACTION_REJECTED') {
        toast.error('You declined the action in your wallet!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return;
      } else {
        toast.error('Something went wrong!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return;
      }
    }
  }

  return (
    <div>
      <ToastContainer />
      <form onSubmit={() => handleSubmit(onSubmit)}>
        <Section>
          <div className="text-[36px] font-semibold">Payment</div>
        </Section>
        <div className="border-b" />
        <div className="mb-[165px]">
          <Section>
            <Grid.Container gap={2} justify="flex-start">
              <Grid xs={12} md={8}>
                <div className={'w-full md:w-auto'}>
                  <AppInput
                    label="Bonus support for Project owner (Optional)"
                    fullWidth={isMobile}
                    width={`${!isMobile && '485px'}`}
                    name={'amount'}
                    placeholder="Enter amount"
                    register={register('amount', {
                      required: true,
                    })}
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
                    Donate
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

export default WithOut;
