import React from 'react';

interface IRoadMapItem {
  name: string;
  maps: string[];
}

function RoadMapItem({ name, maps }: IRoadMapItem) {
  return (
    <div className={'border-r-[1px] p-3'}>
      <div className={'border-b-[1px] relative'}>
        <h3 className="text-[28px] font-semibold mb-[40px]">{name}</h3>
        <img
          className={'absolute top-[65px]'}
          src={'/assets/home/img-root.svg'}
        />
      </div>
      <ul className={'mt-[40px] list-disc p-3 min-w-[150px]'}>
        {maps?.map((item, index) => {
          return (
            <li
              key={index}
              className={'text-base font-normal text-[#4D4D4D] mb-4'}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RoadMapItem;
