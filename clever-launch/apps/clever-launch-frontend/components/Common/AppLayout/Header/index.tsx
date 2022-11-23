import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Section from '../../AppSection';
import { injected } from '../../../../connectors';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import useIsMobile from '../../../../hooks/useMobile';
// import { useModalToggleConnectWallet } from '../../../../store/Application/hooks';
import AppButtonWalletAddress from '../../AppButtonWalletAddress';
import { useAppDispatch } from 'apps/clever-launch-frontend/store/hooks';
import { showModalConnect } from 'apps/clever-launch-frontend/store/slices/modalConnectSlice';
import { divide } from 'lodash';
import {
  getPendingProject,
  postProjectPending,
} from 'apps/clever-launch-frontend/services/create-project';
import useWindowSize from 'apps/clever-launch-frontend/hooks/useWindowSize';
import { projectService } from '../../../../services';
import { toast } from 'react-toastify';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';

function Header() {
  const { account, deactivate } = useWeb3React<Web3Provider>();
  const [isShowNavMobile, setIsShowNavMobile] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { width } = useWindowSize();

  function handleLogout() {
    localStorage.removeItem('access_token');
    deactivate();
  }

  const handleGetProjectPending = async () => {
    if (!account || !localStorage.getItem('access_token')) {
      dispatch(showModalConnect());
    } else {
      try {
        const { data, status } = await projectService.getProjectInReview();
        if (status == 200 || status == 201) {
          toast('1 Project in review ');
          return data;
        }
      } catch (e) {
        try {
          const { data, status } = await getPendingProject({});
          console.log(status);
          if (status == 200 || status == 201) {
            if (!data.projectId) return;
            router.push({
              pathname: '/create-project/[id]',
              query: { id: `${data.projectId}`, tab: TABS.BASIC },
            });
          }
        } catch (error) {
          await handlePostProjectPending();
        }
      }
    }
  };

  const handlePostProjectPending = async () => {
    try {
      const { data, status } = await postProjectPending({});
      if (status == 200 || status == 201) {
        if (!data.projectId) return;
        router.push({
          pathname: '/create-project/[id]',
          query: { id: `${data.projectId}`, tab: TABS.BASIC },
        });
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const handleRouter = (callback) => {
    setIsShowNavMobile(false);
    callback();
  };

  return (
    <Section>
      <nav className=" bg-[#212121] px-2 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="md:px-[112px] flex flex-wrap justify-between items-center mx-auto">
          <img
            onClick={() => router.push('/')}
            src="/assets/logo/logo.svg"
            className="mr-3 h-6 sm:h-9 cursor-pointer"
            alt="Logo"
          />
          <div className="flex md:order-2">
            {width >= 768 ? (
              account ? (
                <AppButtonWalletAddress
                  handleGetProjectPending={handleGetProjectPending}
                />
              ) : (
                <button
                  onClick={() => dispatch(showModalConnect())}
                  type="button"
                  className={`text-black bg-[#E8AA42] focus:ring-4
                focus:outline-none font-medium
                rounded-lg text-[12px] md:visible lg:visible xl:visible px-5 py-2.5 text-center mr-3 md:mr-0`}
                >
                  Connect Wallet
                </button>
              )
            ) : null}
            <button
              onClick={() => setIsShowNavMobile(true)}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {width < 768 ? (
            <div
              className={`fixed top-0 right-0 bottom-0 left-0 bg-[#ffffff] z-[400]
              ${
                isShowNavMobile
                  ? 'translate-x-[0%] transition-transform'
                  : 'translate-x-[100%] transition-transform'
              }
              `}
            >
              <div className="px-[24px] py-[12px] flex justify-between border-b">
                <span>Menu</span>
                <img
                  src="/assets/create-project/x.svg"
                  alt=""
                  onClick={() => setIsShowNavMobile(false)}
                />
              </div>
              <div className="px-[18px] pt-[32px] pb-[10px] text-[#000000] font-semibold text-[20px]">
                Sitemap
              </div>
              <div
                className="px-[18px] py-[10px] border-b text-[#212121]"
                onClick={() => {
                  handleRouter(router.push('/'));
                }}
              >
                Home page
              </div>
              <div
                className="px-[18px] py-[10px] border-b text-[#212121]"
                onClick={() => {
                  handleRouter(router.push('/project'));
                }}
              >
                Project
              </div>
              <div className="px-[18px] py-[10px] border-b text-[#212121]">
                Forum
              </div>
              <div className="px-[18px] py-[10px] border-b text-[#212121]">
                Whitepaper
              </div>
              <div className=" text-[#000000] font-semibold text-[20px] px-[18px] pt-[40px] pb-[17px]">
                Your Profile
              </div>

              <div className="px-[18px]">
                {account ? (
                  <div className="px-[18px] py-[10px] rounded-[8px] bg-[#ffffff] text-[#212121] border border-[#212121] w-fit">
                    {`${account?.slice(0, 5)} ... ${account?.slice(
                      -4,
                      account?.length
                    )}`}
                  </div>
                ) : (
                  <button
                    className="px-[18px] py-[10px] rounded-[8px] bg-[#E8AA42] text-[#212121]"
                    onClick={() => {
                      dispatch(showModalConnect());
                    }}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>

              {account && (
                <div className="mt-[20px]">
                  <div className="px-[18px] py-[10px] text-[#212121] border-b flex justify-between">
                    <span onClick={() => handleGetProjectPending()}>
                      Create your project
                    </span>
                    <img src="/assets/create-project/plus-icon.svg" alt="" />
                  </div>
                  <div className="px-[18px] py-[10px] text-[#212121] border-b">
                    Project management
                  </div>
                  <div
                    className="px-[18px] py-[10px] text-[#212121] border-b"
                    onClick={() => handleRouter(router.push('/profile'))}
                  >
                    User Page
                  </div>
                  <div
                    className="px-[18px] py-[10px] text-[#212121] border-b"
                    onClick={() => handleRouter(router.push('/setting'))}
                  >
                    Settings
                  </div>
                  <div
                    className="px-[18px] py-[10px] text-[#212121] border-b"
                    onClick={() => handleLogout()}
                  >
                    Log out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full md:flex-1 md:ml-8 md:block md:w-auto"
              id="mobile-menu"
            >
              <ul
                className={`flex flex-col md:visible lg:visible xl:visible p-4 mt-4
               rounded-lg md:flex-row md:space-x-8 md:mt-0
               md:text-sm md:font-medium`}
              >
                <li>
                  <a
                    onClick={() => router.push('/')}
                    className="block py-2 pr-4 pl-3 text-white rounded cursor-pointer md:p-0"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/project')}
                    id="dropdownNavbarLink"
                    data-dropdown-toggle="dropdownNavbar"
                    className="flex justify-between items-center py-2 pr-4 pl-3
                  cursor-pointer
                  w-full font-medium block text-white rounded  md:p-0"
                  >
                    Project
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-white rounded  md:p-0"
                  >
                    Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-white rounded  md:p-0"
                  >
                    Whitepaper
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </Section>
  );
}

export default Header;
