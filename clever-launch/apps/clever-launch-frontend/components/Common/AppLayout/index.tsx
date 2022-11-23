import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import ShortenFooter from './ShorttenFooter';
import ModalConnectWallet from '../AppModalConnectWallet';
declare type LayoutProps = {
  pageTitle: string;
  mainContent: JSX.Element;
  isShortenFooter?: boolean;
};

export default function Layout(props: LayoutProps): JSX.Element {
  const { pageTitle, mainContent, isShortenFooter = false } = props;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0"
        />
      </Head>
      <Header />
      <ModalConnectWallet />
      <main>{mainContent}</main>
      {isShortenFooter ? <ShortenFooter /> : <Footer />}
    </>
  );
}
