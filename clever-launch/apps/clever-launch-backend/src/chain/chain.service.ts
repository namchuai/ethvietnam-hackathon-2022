import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { hashMessage } from 'ethers/lib/utils';
import { ConfigService } from '../config/config.service';
import { GeneratedWallet } from './dtos/generated-wallet.interface';
import { DeadEthKeyException } from './exceptions/dead-eth-key.exception';
import { EthKeyMustStartWithHexIndicatorException } from './exceptions/eth-key-must-start-with-hex-indicator.exception';
import { InvalidEthKeyException } from './exceptions/invalid-eth-key.exception';
import { NullEthKeyException } from './exceptions/null-eth-key.exception';

@Injectable()
export class ChainService {
  NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
  DEAD_ADDRESS = '0x000000000000000000000000000000000000dead';

  private readonly provider: ethers.providers.JsonRpcProvider;

  constructor(configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      configService.getChainUrlProvider
    );
  }

  private isValidEthAddress(input: string): boolean {
    return ethers.utils.isAddress(input);
  }

  normalizeUserInputEthAddress(ethKey: string): string {
    if (!this.isValidEthAddress(ethKey)) {
      throw new InvalidEthKeyException();
    }
    if (!ethKey.startsWith('0x')) {
      throw new EthKeyMustStartWithHexIndicatorException();
    }
    const lowerCaseEthKey = ethKey.toLowerCase().trim();
    if (lowerCaseEthKey === this.NULL_ADDRESS) {
      throw new NullEthKeyException();
    }
    if (lowerCaseEthKey === this.DEAD_ADDRESS) {
      throw new DeadEthKeyException();
    }
    return lowerCaseEthKey;
  }

  async recoverAddress(message: string, signature: string): Promise<string> {
    try {
      return ethers.utils.recoverAddress(hashMessage(message), signature);
    } catch (err) {
      return '';
    }
  }

  async signMessage(message: string, privateKey: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(message);
  }

  async getTransaction(
    transactionHash: string
  ): Promise<ethers.providers.TransactionResponse | undefined> {
    try {
      return this.provider.getTransaction(transactionHash);
    } catch (err) {
      return undefined;
    }
  }

  async getTransactionReceipt(
    transactionHash: string
  ): Promise<ethers.providers.TransactionReceipt | undefined> {
    try {
      return this.provider.getTransactionReceipt(transactionHash);
    } catch (err) {
      return undefined;
    }
  }

  async getLatestBlockNumber(): Promise<number> {
    try {
      return this.provider.getBlockNumber();
    } catch (err) {
      return -1;
    }
  }

  generateNewWallet(): GeneratedWallet {
    const wallet = ethers.Wallet.createRandom();
    return {
      walletAddress: wallet.address,
      phrase: wallet.mnemonic.phrase,
      path: wallet.mnemonic.path,
      locale: wallet.mnemonic.locale,
      privateKey: wallet.privateKey,
    };
  }
}
