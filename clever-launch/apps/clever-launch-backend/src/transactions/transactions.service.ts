import { Injectable } from '@nestjs/common';
import {
  CLTransaction,
  ProjectStatus,
  RewardStatus,
  TransactionStatus,
} from '@clever-launch/data';
import { TransactionsRepository } from './transactions.repository';
import { ChainService } from '../chain/chain.service';
import { CreateTransactionInputDto } from './dtos/create-transaction-input.dto';
import { ProjectsService } from '../projects/projects.service';
import { RewardsService } from '../rewards/rewards.service';
import { RewardNotAvailableForThisProject } from '../rewards/exceptions/reward-not-available-project.exception';
import { RewardIsOutOfStockException } from '../rewards/exceptions/reward-out-of-stock.exception';
import { RewardNotAvailableAnymoreException } from '../rewards/exceptions/reward-not-available-any-more.exception';
import { UsersService } from '../users/users.service';
import { ProjectCantReceiveFunding } from './exceptions/project-cant-receive-funding.exception';
import { getUtcTimestamp } from '../utils/date-time';
import { TransactionHashConflictedException } from './exceptions/transaction-hash-conflicted.exception';
import { TransactionNotFoundException } from './exceptions/transaction-not-found.exception';
import { AmountIsLessThanRewardPrice } from '../rewards/exceptions/amount-less-than-reward-price.exception';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly chainService: ChainService,
    private readonly projectsService: ProjectsService,
    private readonly rewardsService: RewardsService,
    private readonly usersService: UsersService
  ) {}

  async getUserTransaction(userId: string): Promise<CLTransaction[]> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    return this.transactionsRepository.getUserTransactions(normalizedUserId);
  }

  async createTransaction(
    userId: string,
    dto: CreateTransactionInputDto
  ): Promise<CLTransaction> {
    const { transactionHash, projectId, rewardId, amount } = dto;
    const user = await this.usersService.getUserOrThrow(userId);

    const project = await this.projectsService.getProjectOrThrow(projectId);
    if (project.status !== ProjectStatus.Validated) {
      throw new ProjectCantReceiveFunding(project.status);
    }

    let rewardName: string | undefined = undefined;

    if (rewardId) {
      const reward = await this.rewardsService.getRewardOrThrow(rewardId);
      if (reward.projectId !== projectId) {
        throw new RewardNotAvailableForThisProject();
      }
      if (reward.rewardStatus !== RewardStatus.Available) {
        throw new RewardNotAvailableAnymoreException();
      }
      if (reward.amountLeft <= 0) {
        throw new RewardIsOutOfStockException();
      }
      if (amount < reward.price) {
        throw new AmountIsLessThanRewardPrice(amount, reward.price);
      }
      rewardName = reward.title;
    }

    try {
      const timestamp = getUtcTimestamp();
      await this.transactionsRepository.createTransaction({
        transactionHash,
        userId: user.id,
        projectId,
        projectTitle: project.title,
        amount,
        transactionStatus: TransactionStatus.Submitted,
        createdAt: timestamp,
        rewardId: rewardId,
        rewardName: rewardName,
        creatorId: project.creatorId,
      });
    } catch (err) {
      throw new TransactionHashConflictedException();
    }
    return this.getTransactionOrThrow(transactionHash);
  }

  async getTransactionOrThrow(txHash: string): Promise<CLTransaction> {
    const tx = await this.getTransaction(txHash);
    if (!tx) {
      throw new TransactionNotFoundException();
    }
    return tx;
  }

  async getTransaction(txHash: string): Promise<CLTransaction | undefined> {
    return this.transactionsRepository.getTransaction(txHash);
  }

  async getProjectTransactions(projectId: string): Promise<CLTransaction[]> {
    // TODO: pagination
    return this.transactionsRepository.getProjectTransactions(projectId);
  }

  async getSubmittedTransaction(): Promise<CLTransaction[]> {
    return this.transactionsRepository.getTransactionsByStatus(
      TransactionStatus.Submitted
    );
  }

  async markAsValid(tx: CLTransaction): Promise<void> {
    const { transactionHash, projectId, amount } = tx;
    return this.transactionsRepository.markTransactionAsValid(
      transactionHash,
      projectId,
      amount,
      getUtcTimestamp()
    );
  }

  async markAsValidWithReward(tx: CLTransaction): Promise<void> {
    const { transactionHash, projectId, amount } = tx;
    return this.transactionsRepository.markTransactionAsValidWithReward(
      transactionHash,
      projectId,
      amount,
      getUtcTimestamp()
    );
  }

  async markAsInvalid(tx: CLTransaction): Promise<void> {
    const { transactionHash, invalidReason } = tx;
    return this.transactionsRepository.markTransactionAsInvalid(
      transactionHash,
      invalidReason ?? 'UNKNOWN',
      getUtcTimestamp()
    );
  }

  async markAsInvalidWithReward(tx: CLTransaction): Promise<void> {
    const { transactionHash, rewardId, invalidReason } = tx;
    if (!rewardId) {
      // this is unlikely to happen
      return;
    }
    return this.transactionsRepository.markTransactionAsInvalidWithReward(
      transactionHash,
      rewardId,
      invalidReason ?? 'UNKNOWN',
      getUtcTimestamp()
    );
  }
}
