import React from 'react';
import { useRouter } from 'next/router';
import { Dropdown, Text } from '@nextui-org/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import * as _ from 'lodash';
import { TABS } from '../../../constants/tabs';
function AppButtonWalletAddress({ handleGetProjectPending }) {
  const { account, deactivate, connector } = useWeb3React();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('access_token');
    deactivate();
  }

  return (
    <div className={'invisible md:visible'}>
      <Dropdown placement="bottom-left">
        <Dropdown.Trigger>
          <button className="bg-transparent text-xs text-white font-semibold hover:text-white py-2 px-4 border border-gray-300 rounded-[8px]">
            {`${account?.slice(0, 5)} ... ${account?.slice(
              -4,
              account?.length
            )}`}
          </button>
        </Dropdown.Trigger>
        <Dropdown.Menu color="default" aria-label="Avatar Actions">
          <Dropdown.Item key="project">
            <div
              className={'flex justify-between'}
              onClick={() => handleGetProjectPending()}
            >
              <Text b color="inherit" css={{ d: 'flex' }}>
                Create Project
              </Text>
              <img src={'/assets/icon/add-p.svg'} />
            </div>
          </Dropdown.Item>
          <Dropdown.Item key="management" withDivider>
            <span
              onClick={() =>
                router.push({
                  pathname: '/profile/[wallet]',
                  query: { wallet: `${account}`, tab: 3 },
                })
              }
            >
              Project management
            </span>
          </Dropdown.Item>
          <Dropdown.Item key="user_page">
            <span
              onClick={() =>
                router.push({
                  pathname: '/profile/[wallet]',
                  query: { wallet: `${account}`, tab: 1 },
                })
              }
            >
              User Page
            </span>
          </Dropdown.Item>
          <Dropdown.Item key="settings" withDivider>
            <span onClick={() => router.push('/setting')}>Settings</span>
          </Dropdown.Item>
          <Dropdown.Item key="logout" color="error" withDivider>
            <span onClick={() => handleLogout()}>Log Out</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default AppButtonWalletAddress;
