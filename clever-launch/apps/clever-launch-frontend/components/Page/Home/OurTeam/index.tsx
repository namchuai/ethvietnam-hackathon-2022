import React, { useEffect, useState } from 'react';
import Background from '../../../Common/AppBackground';
import AppInformationProfile from '../../../Common/AppInformationProfile';
import Section from '../../../Common/AppSection';
import Slider from 'react-slick';
import settings from '../../../../constants/setting-slider';
import { memberService } from '../../../../services';
import { Member } from '@clever-launch/data';
import useWindowSize from '../../../../hooks/useWindowSize';

function OurTeam() {
  const [members, setMembers] = useState<Member[]>([]);
  const { width } = useWindowSize();

  useEffect(() => {
    getListMember().then();
  }, []);

  async function getListMember() {
    try {
      const rawMem = await memberService.getListMember({});
      console.log(rawMem);
      setMembers(rawMem.data);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <Background color={'bg-[#F9FAFB]'}>
      <Section>
        <div className={'flex flex-col p-3 mb-[40px]'}>
          <span className={'text-base font-normal text-[#1F4690] mb-[12px]'}>
            Our Team
          </span>
          <span className={'text-[18px] font-normal text-gray-400'}>
            We’re a small team on a big mission.
          </span>
        </div>
        {width > 768 && (
          <div className="grid grid-cols-4 gap-4 mt-10">
            {members?.map((item) => {
              return (
                <AppInformationProfile
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  title={item.title}
                  avatarUrl={item.avatarUrl}
                  description={item.description}
                  position={item.position}
                  linkedInUrl={item.linkedInUrl}
                />
              );
            })}
          </div>
        )}
        {width < 768 && (
          <div className="slides p-3">
            <Slider {...settings}>
              {members?.map((item) => {
                return (
                  <AppInformationProfile
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    title={item.title}
                    avatarUrl={item.avatarUrl}
                    description={item.description}
                    position={item.position}
                    linkedInUrl={item.linkedInUrl}
                  />
                );
              })}
            </Slider>
          </div>
        )}
      </Section>
    </Background>
  );
}

export default OurTeam;
