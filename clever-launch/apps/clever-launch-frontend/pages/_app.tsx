import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/global.css';
import dynamic from 'next/dynamic';
import { Provider, useDispatch } from 'react-redux';
import store, { persistor } from '../store';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import NextNprogress from 'nextjs-progressbar';
import ModalConnectWallet from '../components/Common/AppModalConnectWallet';
import MetamaskProvider from '../contexts/MetamaskProvider';
import 'react-datepicker/dist/react-datepicker.css';
import ConnectMessage from '../components/Common/ConnectMessageError';
import ModalWrongNetwork from '../components/Common/AppModalWrongNetWork';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-toastify/dist/ReactToastify.css';
import ChangedAddressWallet from '../components/Common/ChangedAccountWallet';
import ModalWaitingTransaction from '../components/Common/AppModalWaiting';
const Web3ProviderNetwork = dynamic(
  () => import('../components/Common/Web3ProviderNetwork'),
  { ssr: false }
);

const getLibrary = (provider: any): Web3Provider => {
  const rpc = new Web3Provider(provider, 'any');
  rpc.pollingInterval = 15000;
  return rpc;
};

function CustomApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/display-name
  const AuthComponent = React.memo(() => {
    const dispatch = useDispatch();
    const { account } = useWeb3React<Web3Provider>();
    const token = localStorage.getItem('access_token') || null;
    useEffect(() => {
      account && token && console.log('test');
    }, [token, account]);

    return null;
  });
  return (
    <>
      <Head>
        <title>Welcome to clever-launch-frontend!</title>
      </Head>
      <main className="app">
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Provider store={store}>
              <AuthComponent />
              <PersistGate loading={null} persistor={persistor}>
                <MetamaskProvider>
                  <Component {...pageProps} />
                </MetamaskProvider>
                <ConnectMessage />
                <ChangedAddressWallet />
                <ModalWaitingTransaction />
                <NextNprogress
                  options={{ easing: 'ease', speed: 200 }}
                  color={'#b7b718'}
                />
                <ModalWrongNetwork />
              </PersistGate>
            </Provider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </main>
    </>
  );
}

export default CustomApp;
