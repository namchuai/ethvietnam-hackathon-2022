import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { AppState } from 'apps/clever-launch-frontend/store';
import {
  hideModalErrorNetWork,
  showModalErrorNetWork,
} from 'apps/clever-launch-frontend/store/slices/errorNetWorkSlice';
import { showModalConnect } from 'apps/clever-launch-frontend/store/slices/modalConnectSlice';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ConnectMessage = () => {
  const { error } = useWeb3React();
  const dispatch = useDispatch();
  const { isShowError } = useSelector(
    (state: AppState) => state.errorNetworkSlice
  );

  useEffect(() => {
    if ((!error && !isShowError) || (error && isShowError)) return;
    if (!error && isShowError) {
      dispatch(hideModalErrorNetWork());
      return;
    }
    if (error instanceof UnsupportedChainIdError) {
      dispatch(showModalErrorNetWork());
      return;
    }
    if (error instanceof UserRejectedRequestError) {
      // message user declined the action in your wallet
      return;
    }
  }, [error]);

  return null;
};

export default ConnectMessage;
