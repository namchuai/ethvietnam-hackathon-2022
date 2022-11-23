import { TransactionRequest } from '@ethersproject/providers';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProjectStatus } from '@clever-launch/data';
import { ConfigService } from '../config/config.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectCantReceiveFunding } from '../transactions/exceptions/project-cant-receive-funding.exception';
import { UsersService } from '../users/users.service';
import { ProjectDepositInputDto } from './dtos/project-deposit-input.dto';

@Injectable()
export class SmartContractService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly clPubKey: string;
  private readonly clSmartContractAddress: string;
  private readonly contract: ethers.Contract;
  private readonly wallet: ethers.Wallet;

  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    configService: ConfigService
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(
      configService.getChainUrlProvider
    );
    this.clPubKey = configService.clPublicAddress;
    this.clSmartContractAddress = configService.clContractAddress;
    const abi = [
      'function deposit(uint128,uint256)',
      'function claimFundBacker(uint128)',
      'function claimFundCreator(uint128)',
      'function createProject(uint128,uint48,uint48,address,uint256) ',
      'function getProjectBackedAmount(uint128) external view returns (uint256)',
      'function getBackerAmount(uint128,address) external view returns (uint256)',
      'function getProjectWalletAddress(uint128) external view returns (address)',
    ];
    this.contract = new ethers.Contract(
      configService.clContractAddress,
      abi,
      this.provider
    );
    this.wallet = new ethers.Wallet(configService.clPrivateKey, this.provider);
  }
  private async getTransactionCount(): Promise<number> {
    return this.provider.getTransactionCount(this.clPubKey);
  }

  async createOnChainProject(
    projectId: string,
    approvedAt: number,
    endAt: number,
    wallet: string,
    fundingGoal: number
  ): Promise<string> {
    const normalizedProjectId = this.normalizeProjectId(projectId);
    const amountInWei = ethers.utils.parseEther(fundingGoal.toString()).toString();

    const nonce = await this.getTransactionCount();
    const transaction: TransactionRequest = {
      from: this.clPubKey,
      to: this.clSmartContractAddress,
      nonce: nonce,
      gasLimit: 500000,
      data: this.contract.interface.encodeFunctionData('createProject', [
        normalizedProjectId,
        approvedAt,
        endAt,
        wallet,
        amountInWei,
      ]),
    };
    const response = await this.wallet.sendTransaction(transaction);
    return response.hash;
  }

  async getOnChainUserBackedAmount(
    projectId: string,
    userId: string
  ): Promise<string> {
    const normalizedProjectId = this.normalizeProjectId(projectId);

    try {
      const amount = await this.contract.getBackerAmount(
        normalizedProjectId,
        userId
      );
      return ethers.utils.formatEther(ethers.BigNumber.from(amount).toString());
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async getOnChainProjectWallet(projectId: string): Promise<string> {
    const normalizedProjectId = this.normalizeProjectId(projectId);

    try {
      const address = await this.contract.getProjectWalletAddress(
        normalizedProjectId
      );

      return address;
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async getOnChainProjectBackedAmount(projectId: string): Promise<string> {
    const normalizedProjectId = this.normalizeProjectId(projectId);

    try {
      const amount = await this.contract.getProjectBackedAmount(
        normalizedProjectId
      );
      return ethers.utils.formatEther(ethers.BigNumber.from(amount).toString());
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async deposit(payload: ProjectDepositInputDto): Promise<string> {
    const { projectId, publicKey, privateKey, amount } = payload;

    const project = await this.projectsService.getProjectOrThrow(projectId);
    if (project.status !== ProjectStatus.Validated) {
      throw new ProjectCantReceiveFunding(project.status);
    }
    await this.usersService.getUserOrThrow(publicKey);

    const normalizedProjectId = this.normalizeProjectId(projectId);
    const amountInWei = ethers.utils.parseEther(amount).toString();
    const wallet = new ethers.Wallet(privateKey, this.provider);

    const nonce = await this.provider.getTransactionCount(publicKey);
    const transaction: TransactionRequest = {
      from: publicKey,
      to: this.clSmartContractAddress,
      nonce: nonce,
      gasLimit: 500000,
      data: this.contract.interface.encodeFunctionData('deposit', [
        normalizedProjectId,
        amountInWei,
      ]),
    };
    const response = await wallet.sendTransaction(transaction);
    return response.hash;
  }

  // TODO move to util
  private normalizeProjectId(projectId: string): string {
    return `0x${projectId.replace(/-/g, '')}`;
  }
}
