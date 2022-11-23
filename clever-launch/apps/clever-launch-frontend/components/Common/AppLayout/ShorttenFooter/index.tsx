import React from 'react';
import Section from '../../../Common/AppSection';
import Background from '../../AppBackground';
function ShortenFooter() {
  return (
    <Background color={'bg-[#F9FAFB]'}>
      <Section yPadding={'py-10'}>
        <footer className="">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div className="flex justify-center">
              <img
                src={'/assets/logo/logo-gray.svg'}
                className="h-8 ml-[70px] md:!ml-[0px]"
                alt="FlowBite Logo"
              />
            </div>

            <div className="flex justify-center my-[30px] md:!my-[0px]">
              <span className="text-base text-gray-500 sm:text-center dark:text-gray-400">
                © 2022{' '}
                <a href="https://flowbite.com/" className="hover:underline">
                  Clever Launch
                </a>
                . All Rights Reserved.
              </span>
            </div>

            <div className="flex mt-4 justify-center space-x-6 md:justify-center md:mt-0">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <img src={'/assets/home/twitter.svg'} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <img src={'/assets/home/kedin.svg'} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <img src={'/assets/home/fb.svg'} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <img src={'/assets/home/discord.svg'} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <img src={'/assets/home/tele.svg'} />
              </a>
            </div>
          </div>
        </footer>
      </Section>
    </Background>
  );
}

export default ShortenFooter;
