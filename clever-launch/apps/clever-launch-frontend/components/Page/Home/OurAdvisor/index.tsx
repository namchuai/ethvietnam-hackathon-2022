import React, { useState, useEffect } from 'react';
import Section from '../../../Common/AppSection';
import AppCard from '../../../Common/AppCard';
import Slider from 'react-slick';
// import settings from '../../../../constants/setting-slider';
import { advisorService } from '../../../../services';
import { Advisor } from '@clever-launch/data';

function OurAdvisor() {
  const [outAdvisors, setOutAdvisors] = useState<Advisor[]>([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    centerPadding: 30,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: outAdvisors.length > 3,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    getListOutAdvisor().then();
  }, []);

  async function getListOutAdvisor() {
    try {
      const rawOut = await advisorService.getListAdvisor({});
      setOutAdvisors(rawOut.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Section>
      <span className={'text-base font-normal text-[#1F4690]'}>
        Our Advisor
      </span>
      <div className="slides mt-[12px] md:mt-[32px]">
        <Slider {...settings}>
          {outAdvisors?.map((item, index) => {
            return (
              <AppCard
                key={index}
                url={item?.avatarUrl}
                title={item?.name}
                description={item?.description}
              />
            );
          })}
        </Slider>
      </div>
    </Section>
  );
}

export default OurAdvisor;
