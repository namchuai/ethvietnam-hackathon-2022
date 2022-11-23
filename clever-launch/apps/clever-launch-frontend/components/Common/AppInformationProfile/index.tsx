import React from 'react';
import { Member } from '@clever-launch/data';
import AppAvatar from '../../Base/UI/Avatar';

function AppInformationProfile({
  avatarUrl,
  linkedInUrl,
  name,
  title,
  description,
}: Member) {
  return (
    <div className="flex flex-col mt-4">
      <div className="rounded-lg max-w-sm flex flex-col md:items-start">
        <a href="#!">
          <AppAvatar className={'grayscale rounded-full'} src={avatarUrl} />
        </a>
        <div className={'text-left'}>
          <h5 className="text-gray-900 text-[18px] leading-[28px] font-semibold mt-[20px]">
            {name}
          </h5>
          <h6 className="text-gray-900 text-[16px] leading-[24px] text-[#1F4690] font-normal mb-2">
            {title}
          </h6>
          <p className="text-[14px] leading-[20px] text-[#4D4D4D] mb-4 font-normal min-h-[60px]">
            {description}
          </p>
          <a href={`${linkedInUrl}`} target={'_blank'} rel="noreferrer">
            <img
              className={'cursor-pointer'}
              src="/assets/home/linkedin.svg"
              alt="logo"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AppInformationProfile;
