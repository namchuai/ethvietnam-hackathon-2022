import React from 'react';

interface IAppCartViewBenefit {
  url: string;
  title: string;
  description: string;
}

function AppCardViewBenefit({ url, title, description }: IAppCartViewBenefit) {
  return (
    <div className="flex w-full flex-col mb-2">
      <div className="rounded-lg max-w-sm bg-[#F9FAFB] rounded-[12px] shadow">
        <div
          className={
            'flex px-[16px] py-[24px] border-b-[1px] border-b-[#E4E7EC] items-center'
          }
        >
          <img src={url} />
          <h5 className={'font-semibold text-[20px] leading-[28px] ml-4'}>
            {title}
          </h5>
        </div>
        <div className={'px-[16px] pt-[20px] pb-[56px] min-h-[145px]'}>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default AppCardViewBenefit;
