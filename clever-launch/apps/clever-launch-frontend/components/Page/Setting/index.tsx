import React, { useEffect, useState } from 'react';
import Section from '../../Common/AppSection';
import Verification from './Verification';
import UpdateProfile from './UpdateProfile';
import { getContries } from 'apps/clever-launch-frontend/services/create-project';

function SettingPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [listCountries, setListCountries] = useState([]);

  const [listTab] = useState([
    {
      tabId: 1,
      title: 'Edit Profile',
    },
    {
      tabId: 2,
      title: 'Verification',
    },
  ]);

  const handleGetCountry = async () => {
    try {
      const { data, status } = await getContries();
      if (status == 200 || status == 201) {
        setListCountries(
          data?.map((item) => {
            return {
              value: item,
              name: item,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCountry();
  }, []);

  return (
    <div>
      <Section>
        <div className="flex justify-start items-center gap-[3px]">
          {listTab.map((item, index) => {
            return (
              <button
                key={index}
                className={`py-[8px] px-[12px] ${
                  activeTab == item.tabId
                    ? 'bg-[#E4E7EC] text-[#1F4690] rounded-[6px]'
                    : ''
                } text-[14px] font-normal text-[#4D4D4D]`}
                onClick={() => setActiveTab(item.tabId)}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </Section>
      <div className="border-b" />
      {activeTab == 2 && <Verification listCountries={listCountries} />}
      {activeTab == 1 && <UpdateProfile listCountries={listCountries} />}
    </div>
  );
}

export default SettingPage;
