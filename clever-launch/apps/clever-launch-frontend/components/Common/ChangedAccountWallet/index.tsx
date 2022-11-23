import { useWeb3React } from '@web3-react/core';
import { showModalConnect } from 'apps/clever-launch-frontend/store/slices/modalConnectSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const ChangedAddressWallet = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!account || !library?.provider) return;
    const handleChangeAccount = () => {
      localStorage.removeItem('access_token');
      dispatch(showModalConnect());
    };
    library.provider.on('accountsChanged', handleChangeAccount);
    return () => {
      library.provider?.removeListener('accountsChanged', handleChangeAccount);
    };
  }, [account]);

  return null;
};

export default ChangedAddressWallet;
