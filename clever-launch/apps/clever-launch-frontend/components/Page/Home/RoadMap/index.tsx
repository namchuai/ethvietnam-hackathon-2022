import React from 'react';
import RoadMapItem from '../../../Common/AppRoadMap';
import Section from '../../../Common/AppSection';
import Background from '../../../Common/AppBackground';

function RoadMap() {
  return (
    <Background color={'bg-[#F9FAFB]'}>
      <Section>
        <span className={'text-base font-normal text-[#1F4690]'}>Road Map</span>
        <div
          className={
            'flex flex-col md:flex-row mb-4 justify-between mt-[12px] md:mt-[32px]'
          }
        >
          <RoadMapItem
            name={'Q3.2022'}
            maps={[
              'Idea &Team setup (in-house)',
              'Creator Community Building (Art/design web3 creators, content creators, physical project creators',
              'Backer Community Building ( donators , investors)',
            ]}
          />
          <RoadMapItem
            name={'Q4.2022'}
            maps={['Clever Launch closed Alpha test', 'Raise Seed Round']}
          />
          <RoadMapItem
            name={'Q1.2023'}
            maps={[
              'Raise Private Round',
              'Open Beta test (Testnet) for creators & donators',
              'Clever Launch Marketplace closed Alpha test',
            ]}
          />
          <RoadMapItem
            name={`Q2.2023`}
            maps={[
              'IDO & IEO',
              'Test to expand to content creator projects',
              'Clever Launch Marketplace open beta',
              'Clever launch Mainnet for creators & donators',
            ]}
          />
          <RoadMapItem
            name={`2024`}
            maps={[
              'Expand to physical projects',
              'Expand to creators & investors',
              'Physical Product Marketplace',
              'Build community support to help creator launch virtual & physical product projects',
              'Wallet',
            ]}
          />
        </div>
      </Section>
    </Background>
  );
}

export default RoadMap;
