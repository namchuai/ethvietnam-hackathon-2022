import { InjectedConnector } from '@web3-react/injected-connector';
import { CHAINS_ID } from '../constants/chains';
import { IS_NETWORK_MAINNET } from '../constants/network';

const POLLING_INTERVAL = 12000;
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string,
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    // Ethereum
    // 1, 3, 4,

    5,
    //  42,
    // Poly
    // 137, 80001,
  ],
});

export const DefaultNetwork = IS_NETWORK_MAINNET
  ? CHAINS_ID.BSC
  : CHAINS_ID.BSC_TESTNET;
