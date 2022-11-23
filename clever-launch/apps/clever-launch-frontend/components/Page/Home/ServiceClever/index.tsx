import React from 'react';
import Section from '../../../Common/AppSection';
import { LIST_SERVICE } from '../../../../constants/config';
import AppCardViewBenefit from '../../../Common/AppCardViewBenefit';
import Slider from 'react-slick';
import settings from '../../../../constants/setting-slider';
import { useRouter } from 'next/router';
import AppButton from '../../../Common/AppButton';
import color from '../../../Base/theme/base/colors';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { projectService } from '../../../../services';
import { toast, ToastContainer } from 'react-toastify';
import { showModalConnect } from '../../../../store/slices/modalConnectSlice';
import {
  getPendingProject,
  postProjectPending,
} from '../../../../services/create-project';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';

function ServiceClever() {
  const route = useRouter();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const handleGetProjectPending = async () => {
    if (!account || !localStorage.getItem('access_token')) {
      dispatch(showModalConnect());
    } else {
      try {
        const { data, status } = await projectService.getProjectInReview();
        if (status == 200 || status == 201) {
          toast.info('1 Project in review ', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
          return data;
        }
      } catch (error) {
        try {
          const { data, status } = await getPendingProject({});
          if (status == 200 || status == 201) {
            console.log(`data`, data);

            if (!data.projectId) return;
            route.push({
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
        route.push({
          pathname: '/create-project/[id]',
          query: { id: `${data.projectId}`, tab: TABS.BASIC },
        });
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };

  return (
    <Section>
      <ToastContainer />
      <div className={'mb-4 md:mb-[64px] md:mt-[40px]'}>
        <span className={'text-black text-[36px] font-semibold'}>
          The first crowdfunding Web3 platform for Creators
        </span>
        <p
          className={
            'text-[#4D4D4D] text-sm mb-4 md:text-xl font-normal mt-6 md:mb-[40px]'
          }
        >
          Our solution help creators raise crypto funds from backers in a click
          while <br />
          backers can invest or donate to creators with cryptocurrency based on
          <br />
          DAO community, decentralized governance, and transparency
        </p>
        <AppButton
          auto
          onClick={() => handleGetProjectPending()}
          bgCustom={`${color.orange['300']}`}
        >
          Create a Project
        </AppButton>
      </div>
      <div className="slides">
        <Slider {...settings}>
          {LIST_SERVICE.map((item, index) => {
            return (
              <AppCardViewBenefit
                key={index}
                title={item.title}
                url={item.url}
                description={item.description}
              />
            );
          })}
        </Slider>
      </div>
    </Section>
  );
}

export default ServiceClever;
