import React, { useState, useEffect } from 'react';
import { Modal, Text, Input, Row, Checkbox } from '@nextui-org/react';
import useMobile from 'apps/clever-launch-frontend/hooks/useMobile';
import { injected } from '../../../connectors';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { authService } from 'apps/clever-launch-frontend/services';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'apps/clever-launch-frontend/store';
import { hideModalConnect } from 'apps/clever-launch-frontend/store/slices/modalConnectSlice';

export default function ModalConnectWallet() {
  const isMobile = useMobile();
  const dispatch = useDispatch();
  const { isShow } = useSelector((state: AppState) => state.modalConnectSlice);
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const [isLogin, setIsLogin] = useState(false);

  async function handleConnectWallet() {
    try {
      const { ethereum } = window as any;
      if (ethereum?.isMetaMask) {
        await activate(injected);
        setIsLogin(true);
        dispatch(hideModalConnect());
        return;
      }
      window.open('https://metamask.io/download.html');
    } catch (error) {}
  }

  const handlePostAuthNonce = async () => {
    try {
      const res = await authService.postDataAuthNonce({ ethKey: account });
      await signLogin(res.data?.nonce.toString());
      setIsLogin(false);
    } catch (error) {}
  };

  const signLogin = async (nonce: string) => {
    if (library) {
      try {
        const signer = library.getSigner();
        const signature = await signer.signMessage(nonce);
        handlePostAuthWallet(signature);
      } catch (error) {
        console.log(`signMessage`, error);
      }
    }
  };

  const handlePostAuthWallet = async (signature: string) => {
    try {
      const res = await authService.postDataAuthWallet({
        username: account,
        password: signature,
      });
      localStorage.setItem('access_token', res.data?.accessToken);
    } catch (error) {}
  };

  useEffect(() => {
    isLogin && handlePostAuthNonce();
  }, [isLogin]);

  return (
    <div className={'w-full md:w-auto'}>
      <Modal
        css={{
          borderRadius: `${isMobile && '0px'}`,
          height: `${isMobile && '100vh'}`,
          marginTop: `${isMobile && '-15px'}`,
        }}
        closeButton={false}
        aria-labelledby="modal-title"
        open={isShow}
        onClose={() => dispatch(hideModalConnect())}
      >
        <Row
          justify="space-between"
          align={'center'}
          style={{
            borderBottom: '1px solid #80808063',
            padding: '10px 24px 15px 24px',
          }}
        >
          <Text size={16}>Connect your wallet</Text>
          <img
            onClick={() => dispatch(hideModalConnect())}
            src={'/assets/images/close.svg'}
          />
        </Row>
        <Modal.Body style={{ paddingBottom: '50px' }}>
          <Text size={14}>
            If you don't have a wallet yet, you can select a provider and create
            one now.
          </Text>
          <div
            onClick={handleConnectWallet}
            className={
              'flex justify-between border rounded-[8px] px-4 py-3 mb-2 hover:border-black cursor-pointer'
            }
          >
            <div className={'flex'}>
              <img src={'/assets/logo/metamask.svg'} />
              <span className={'ml-6 text-base font-normal'}>Metamask</span>
            </div>
            <img src={'/assets/icon/arrow-right.svg'} />
          </div>

          <div
            className={
              'flex justify-between border rounded-[8px] px-4 py-3 mb-2 hover:border-black cursor-pointer'
            }
          >
            <div className={'flex'}>
              <img src={'/assets/logo/wallet-connect.svg'} />
              <span className={'ml-6 text-base font-normal'}>
                Wallet connect
              </span>
            </div>
            <img src={'/assets/icon/arrow-right.svg'} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
