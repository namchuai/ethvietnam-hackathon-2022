import { Router, useRouter } from 'next/router';
import React from 'react';
import AppButton from '../AppButton';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

interface IAppProjectManageItem {
  project?: any;
}

function AppProjectManageItem({ project }: IAppProjectManageItem) {
  const router = useRouter();
  const { account } = useWeb3React<Web3Provider>();

  return (
    <div
      className={'flex flex-col md:flex-row md:w-full max-w-[800px] mt-[40px]'}
    >
      {project?.introType === 'Image' ? (
        <img
          src={project?.introUrl}
          className={'w-[384px] rounded rounded-[8px] object-contain h-[219px]'}
        />
      ) : (
        <iframe
          width={'100%'}
          height="219px"
          src={project?.introUrl.replace('watch?v=', 'embed/')}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}
      <div
        className={'flex flex-col justify-between ml-0 md:ml-6 mt-4 md:mt-0'}
      >
        <div className={'mb-[20px]'}>
          <h3 className={'text-black font-semibold text-[20px] mb-[20px]'}>
            {project?.title}
          </h3>
          <p className={'text-[#4D4D4D] text-base font-normal'}>
            {project?.subTitle}
          </p>
        </div>
        {project?.walletAddress === account.toLowerCase() && (
          <AppButton
            bgCustom={'#E8AA42'}
            css={{ width: '200px' }}
            onClick={() =>
              router.push({
                pathname: '/project/update/[pid]',
                query: { pid: project.id },
              })
            }
          >
            Update project
          </AppButton>
        )}
      </div>
    </div>
  );
}

export default AppProjectManageItem;
