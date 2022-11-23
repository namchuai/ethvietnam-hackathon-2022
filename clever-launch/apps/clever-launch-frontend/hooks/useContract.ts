import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { CLEVER_ADDRESS, CLT_TOKEN_ADDRESS } from '../assets/address';
import ERC20_ABI from '../assets/abi/ERC20_ABI.json';
import CLEVER_LAUNCH_ABI from '../assets/abi/CLEVER_LAUNCH_ABI.json';

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider;
}

export function getContract(
  address: string,
  ABI: any,
  provider: JsonRpcProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(provider, account) as any
  );
}

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

export function useERC20Contract(chainId: any, withSignerIfPossible?: boolean) {
  return useContract(
    CLT_TOKEN_ADDRESS[chainId],
    ERC20_ABI,
    withSignerIfPossible
  );
}

export function useCleverLaunchContract(
  chainId: any,
  withSignerIfPossible?: boolean
) {
  return useContract(
    CLEVER_ADDRESS[chainId],
    CLEVER_LAUNCH_ABI,
    withSignerIfPossible
  );
}
