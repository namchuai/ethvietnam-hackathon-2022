import React, { useEffect, useState } from 'react';
import { injected } from '../../connectors';
import { useWeb3React } from '@web3-react/core';

function MetamaskProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const {
    active: networkActive,
    error: networkError,
    activate,
  } = useWeb3React();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        //todo check token and state user store
        const token = localStorage.getItem('access_token');
        console.log(token, 'token');
        if (isAuthorized && !networkActive && !networkError && token) {
          activate(injected).then();
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activate, networkActive, networkError]);
  if (loaded) {
    return children;
  }
  return <>...</>;
}

export default MetamaskProvider;
