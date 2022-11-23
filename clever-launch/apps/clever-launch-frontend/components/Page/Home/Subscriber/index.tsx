import React from 'react';
import Background from '../../../Common/AppBackground';
import Section from '../../../Common/AppSection';
import ModalSubscriber from '../../../Common/AppModalSubscriber';

function Subscriber() {
  return (
    <Background color={'bg-black'}>
      <Section yPadding={'py-16'}>
        <div
          className={'flex flex-col md:flex-row justify-between items-center'}
        >
          <div>
            <span className={'text-xl font-semibold text-white'}>
              Sign up to have 50% off
            </span>
            <p className={'text-white text-base font-normal'}>
              For Creators: You will receive 50% off on raising fund fee
              <br />
              For Backers: Every month, we will send out new art, design, NFT,
              content projects to you
            </p>
          </div>
          <ModalSubscriber />
        </div>
      </Section>
    </Background>
  );
}

export default Subscriber;
