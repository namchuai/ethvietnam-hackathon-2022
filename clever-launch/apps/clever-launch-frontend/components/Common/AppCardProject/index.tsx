import React from 'react';
import { Progress } from '@nextui-org/react';
import { useRouter } from 'next/router';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { checkLinkVideo } from '../../../utils/checkLinkVideo';
import { getUrlVideo } from '../../../utils/getUrlVideo';
const numeral = require('numeral');
const AppPlayerVideo = dynamic(() => import('../AppPlayerVideo'), {
  ssr: false,
});

interface ICartProject {
  url: string;
  title: string;
  subTitle?: string;
  description?: string;
  author: string;
  numberOfPledged: number;
  price: number;
  tags: Array<{
    value: string;
    title: string;
  }>;
  createdAt: any;
  id?: any;
  durationInDay: any;
  type?: any;
}

function CardProject({
  url,
  title,
  description,
  durationInDay,
  subTitle,
  author,
  price,
  numberOfPledged,
  tags,
  createdAt,
  id,
  type,
}: ICartProject) {
  console.log(url, 'url');
  const route = useRouter();
  const durationDate = moment(createdAt).add(durationInDay, 'days');
  console.log(id, 'id');

  return (
    <div
      onClick={() => route.push(`/project/${id}`)}
      className="w-full hover:cursor-pointer"
    >
      <div className="rounded-lg">
        {type === 'Image' ? (
          <img
            className="rounded-[12px] w-full h-[219px] object-cover"
            src={url}
            alt=""
          />
        ) : (
          <div className={'h-[219px]'}>
            <AppPlayerVideo
              type={url && checkLinkVideo(url) ? 'youtube' : 'mp4'}
              url={url}
            />
          </div>
        )}
        <div className="py-6">
          <h5 className="text-gray-900 text-xl font-medium mb-2 line-clamp-1">
            {title}
          </h5>
          <p className="text-[#4D4D4D] text-base mb-4 min-h-[90px]">
            {subTitle}
          </p>
          <h6 className={'text-base font-normal text-gray-500'}>By {author}</h6>
          <h3 className={'text-[28px] font-semibold text-[#1F4690] mt-[44px]'}>
            {numeral(price).format('$0,0')}
          </h3>
          <h5 className={'text-xs font-normal text-[#4D4D4D] mb-4'}>
            pledged of {numeral(numberOfPledged).format('$0,0')} goal
          </h5>
          <Progress
            color="primary"
            size="xs"
            value={(Math.round(price / numberOfPledged) || 0) * 100}
          />
          <div className={'mt-[14px]'}>
            <span className={'text-xs font-normal'}>
              {durationDate.diff(moment(), 'days')} days left
            </span>
            {tags?.map((tag, index) => {
              return (
                <span
                  key={index}
                  className={'text-xs font-normal text-[#1F4690] ml-4'}
                >
                  {tag?.title}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardProject;
