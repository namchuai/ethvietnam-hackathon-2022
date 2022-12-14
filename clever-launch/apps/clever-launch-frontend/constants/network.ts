export const IS_NETWORK_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'MAINNET';

// ENDPOINT
export const NETWORK_BSC_ENDPOINT = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_BSC_NETWORK_ENDPOINT
  : process.env.NEXT_PUBLIC_BSC_NETWORK_ENDPOINT__TESTNET;

export const NETWORK_POLY_ENDPOINT = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_POLY_NETWORK_ENDPOINT
  : process.env.NEXT_PUBLIC_POLY_NETWORK_ENDPOINT__TESTNET;

// FULLNODE
export const NETWORK_BSC_FULLNODE = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_BSC_FULLNODE
  : process.env.NEXT_PUBLIC_BSC_FULLNODE__TESTNET;

export const NETWORK_POLY_FULLNODE = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_POLY_FULLNODE
  : process.env.NEXT_PUBLIC_POLY_FULLNODE__TESTNET;

// NETWORK-NAME
export const NEXT_PUBLIC_NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME;

// 1 BLOCK => MILLISECONDS
export const BSC_1_BLOCK_TO_MILLISECONDS = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_BSC_1_BLOCK_TO_MILLISECONDS
  : process.env.NEXT_PUBLIC_BSC_1_BLOCK_TO_MILLISECONDS__TESTNET;
export const POLY_1_BLOCK_TO_MILLISECONDS = IS_NETWORK_MAINNET
  ? process.env.NEXT_PUBLIC_POLY_1_BLOCK_TO_MILLISECONDS
  : process.env.NEXT_PUBLIC_POLY_1_BLOCK_TO_MILLISECONDS__TESTNET;
