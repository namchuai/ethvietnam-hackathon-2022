import React, { useState, useEffect } from 'react';
import { backerService } from '../../../../services';

function OurBacker() {
  const [backers, setBackers] = useState([]);

  useEffect(() => {
    getListBacker().then();
  }, []);

  async function getListBacker() {
    try {
      const rawBacker = await backerService.getBacker();
      setBackers(rawBacker?.data.data);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className={'flex items-center flex-col p-8'}>
      <span className={'text-base font-normal text-[#1F4690]'}>Our Backer</span>
      <div className="grid grid-cols-3 gap-6 mt-10">
        {backers?.map((backer, index) => {
          return <img key={index} src={'/assets/home/logo-layer.svg'} />;
        })}
      </div>
    </div>
  );
}

export default OurBacker;
