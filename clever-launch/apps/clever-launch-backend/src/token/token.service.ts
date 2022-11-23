import { TransactionRequest } from '@ethersproject/providers';
import { Injectable } from '@nestjs/common';

import { ethers } from 'ethers';
import { CLPrivilege } from '@clever-launch/data';
import { ChainService } from '../chain/chain.service';
import { ConfigService } from '../config/config.service';
import { PrivilegesService } from '../privileges/privileges.service';
import { UsersService } from '../users/users.service';
import { ApproveSpenderInputDto } from './dtos/approve-spender-input.dto';
import { GiveAwayInputDto } from './dtos/give-away-input.dto';
import { UserDoNotHavePermissionException } from '../privileges/exceptions/user-do-not-have-permission.exception';

@Injectable()
export class TokenService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly contract: ethers.Contract;
  private readonly clPubKey: string;
  private readonly clTokenAddress: string;
  private readonly clContractAddress: string;

  private readonly wallet: ethers.Wallet;

  constructor(
    private readonly usersService: UsersService,
    private readonly chainService: ChainService,
    private readonly privilegesService: PrivilegesService,
    configService: ConfigService
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(
      configService.getChainUrlProvider
    );
    this.clPubKey = configService.clPublicAddress;
    const abi = [
      'function approve(address,uint256) public returns (bool)',
      'function balanceOf(address) public view returns (uint256)',
      'function transfer(address,uint256) public returns (bool)',
    ];
    this.clTokenAddress = configService.clTokenAddress;
    this.clContractAddress = configService.clContractAddress;
    this.contract = new ethers.Contract(
      this.clTokenAddress,
      abi,
      this.provider
    );
    this.wallet = new ethers.Wallet(configService.clPrivateKey, this.provider);
  }

  private async getTransactionCount(): Promise<number> {
    return this.provider.getTransactionCount(this.clPubKey);
  }

  async approve(
    userId: string,
    payload: ApproveSpenderInputDto
  ): Promise<string> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    await this.usersService.getUserOrThrow(normalizedUserId);
    const { amount, privateKey } = payload;

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const amountInWei = ethers.utils.parseEther(amount).toString();
    const nonce = await this.provider.getTransactionCount(normalizedUserId);

    const transaction: TransactionRequest = {
      from: normalizedUserId,
      to: this.clTokenAddress,
      nonce: nonce,
      gasLimit: 500000,
      data: this.contract.interface.encodeFunctionData('approve', [
        this.clContractAddress,
        amountInWei,
      ]),
    };
    const response = await wallet.sendTransaction(transaction);
    return response.hash;
  }

  async balanceOf(userId: string): Promise<string> {
    await this.usersService.getUserOrThrow(userId);

    try {
      const amount = await this.contract.balanceOf(userId);
      return ethers.utils.formatEther(ethers.BigNumber.from(amount).toString());
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async getCleverLaunchBalance(): Promise<string> {
    return this.balanceOf(this.clPubKey);
  }

  async giveAway(userId: string, payload: GiveAwayInputDto): Promise<string> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    await this.usersService.getUserOrThrow(normalizedUserId);

    // TODO check permission below is not working
    const havePermission = await this.privilegesService.isUserHavePermissionFor(
      normalizedUserId,
      CLPrivilege.GiveAway
    );

    if (!havePermission) {
      throw new UserDoNotHavePermissionException();
    }
    const { recipientAddress, amount } = payload;

    const normalizedRecipientAddress =
      this.chainService.normalizeUserInputEthAddress(recipientAddress);

    const amountInWei = ethers.utils.parseEther(amount).toString();
    const nonce = await this.getTransactionCount();
    const transaction: TransactionRequest = {
      from: this.clPubKey,
      to: this.clTokenAddress,
      nonce: nonce,
      gasLimit: 500000,
      data: this.contract.interface.encodeFunctionData('transfer', [
        normalizedRecipientAddress,
        amountInWei,
      ]),
    };
    const response = await this.wallet.sendTransaction(transaction);
    return response.hash;
  }
}
