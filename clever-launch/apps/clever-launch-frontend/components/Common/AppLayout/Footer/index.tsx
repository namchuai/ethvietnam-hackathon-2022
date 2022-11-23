import React from 'react';
import Section from '../../../Common/AppSection';
import Background from '../../AppBackground';

function Footer() {
  return (
    <Background color={'bg-[#F9FAFB]'}>
      <Section yPadding={'py-10'}>
        <footer className="p-2">
          <div className="md:flex md:justify-between">
            <div className="mb-6 p-2 md:p-0">
              <a className="flex items-center mb-[42px]">
                <img
                  src={'/assets/logo/logo-gray.svg'}
                  className="mr-3 h-8"
                  alt="FlowBite Logo"
                />
              </a>
              <span className={'text-base font-normal text-gray-400'}>
                The first crowdfunding platform for Creators
              </span>
            </div>
            <div className="p-2 md:p-0 grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 md:w-[60%] sm:w-auto">
              <div>
                <h2 className="mb-6 text-base font-normal text-gray-400">
                  Sitemap
                </h2>
                <ul className="text-black">
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Homepage
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Project
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Forum
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Whitepaper
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-base font-normal text-gray-400">
                  Legal
                </h2>
                <ul className="text-black">
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Term of services
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Terms and Conditions
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-base font-normal text-gray-400">
                  Join us
                </h2>
                <ul className="text-black">
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Telegram
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Discord
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Linkedin
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Facebook
                    </a>
                  </li>
                  <li className="mb-3">
                    <a className="hover:cursor-pointer text-base font-normal cursor-pointer">
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-base text-gray-500 sm:text-center dark:text-gray-400">
              © 2022{' '}
              <a href="https://flowbite.com/" className="hover:underline">
                Clever Launch
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
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

export default Footer;
