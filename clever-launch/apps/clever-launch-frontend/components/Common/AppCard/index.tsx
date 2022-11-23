import React from 'react';

interface IAppCard {
  url: string;
  title: string;
  description: string;
}

function AppCard({ url, title, description }: IAppCard) {
  return (
    <div className="flex justify-center cursor-pointer">
      <div className="rounded-lg rounded-md max-w-sm">
        <a href="#!">
          <img className="rounded-[12px] w-full" src={url} alt="" />
        </a>
        <div className="py-6">
          <h5 className="text-gray-900 text-xl font-medium mb-2">{title}</h5>
          <p className="text-gray-700 text-base mb-4">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
