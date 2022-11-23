import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CLTransaction, Configuration } from '@clever-launch/data';
import { ChainService } from '../chain/chain.service';
import { ConfigService } from '../config/config.service';
import { TransactionsService } from './transactions.service';
import { BN } from 'bn.js';
import { getUtcTimestamp } from '../utils/date-time';
import { UserBackersService } from '../user-backers/user-backers.service';

@Injectable()
export class TransactionValidatorService {
  private clContractAddress: string;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly chainService: ChainService,
    private readonly userBackersService: UserBackersService,
    configService: ConfigService
  ) {
    this.clContractAddress = configService.clContractAddress;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async validateTransactions() {
    const validatingTxs =
      await this.transactionsService.getSubmittedTransaction();
    if (validatingTxs.length === 0) {
      return;
    }
    const currentBlockNumber = await this.chainService.getLatestBlockNumber();
    if (currentBlockNumber === -1) {
      console.error(`Cannot get block number.`);
      return;
    }

    const invalidTxs: CLTransaction[] = [];
    const validTxs: CLTransaction[] = [];

    try {
      const currentBlockNumber = await this.chainService.getLatestBlockNumber();

      for (const tx of validatingTxs) {
        const transaction = await this.chainService.getTransaction(
          tx.transactionHash
        );

        if (!transaction) {
          console.log(`Cannot get transaction of ${tx.transactionHash}`);
          const currentTime = getUtcTimestamp();
          if (currentTime - tx.createdAt > 3600 * 1000) {
            tx.invalidReason = `Invalid transaction hash`;
            invalidTxs.push(tx);
          }
          continue;
        }

        // currently we only accept transfer CLT
        if (!transaction.data.startsWith('0xcc8cd1bf')) {
          tx.invalidReason = `Transaction is not transfer transaction from ERC20 contract`;
          invalidTxs.push(tx);
          continue;
        }

        const params = this.chunkString(transaction.data.substring(10), 64);
        if (!params || params.length !== 2) {
          tx.invalidReason = `Transaction is not transfer transaction from ERC20 contract`;
          invalidTxs.push(tx);
          continue;
        }
        if (tx.userId.toLowerCase() !== transaction.from.toLowerCase()) {
          tx.invalidReason = `Transaction is not from ${tx.userId.toLowerCase()}`;
          invalidTxs.push(tx);
          continue;
        }

        if (this.clContractAddress !== (transaction.to ?? '').toLowerCase()) {
          tx.invalidReason = `Transaction is not to Clever Launch Contract address ${(
            transaction.to ?? ''
          ).toLowerCase()}`;
          invalidTxs.push(tx);
          continue;
        }

        const projectId = params[0];
        const amount = new BN(params[1], 16)
          .div(new BN('1000000000000000000', 10))
          .toString(10);

        if (!projectId.endsWith(this.normalizeProjectId(tx.projectId))) {
          tx.invalidReason = `Mismatch project id ${projectId} - ${tx.projectId}`;
          invalidTxs.push(tx);
          continue;
        }

        if (amount !== tx.amount.toString()) {
          tx.invalidReason = `Donate amount mismatch ${tx.amount}, onchain: ${amount}`;
          invalidTxs.push(tx);
          continue;
        }

        const receipt = await this.chainService.getTransactionReceipt(
          tx.transactionHash
        );

        if (!receipt) {
          continue;
        }

        if (!receipt.status || receipt.status !== 1) {
          tx.invalidReason = 'Transaction failed onchain';
          invalidTxs.push(tx);
          continue;
        }

        if (receipt.contractAddress) {
          tx.invalidReason = 'Contract creation transaction';
          invalidTxs.push(tx);
          continue;
        }

        if (receipt.confirmations < Configuration.MIN_BLOCK_VALID_COUNT) {
          continue;
        }

        if (
          currentBlockNumber - receipt.blockNumber <
          Configuration.MIN_BLOCK_VALID_COUNT
        ) {
          continue;
        }

        tx.blockNumber = receipt.blockNumber;
        tx.blockHash = receipt.blockHash;

        validTxs.push(tx);
      }

      for (const tx of invalidTxs) {
        if (tx.rewardId) {
          await this.transactionsService.markAsInvalidWithReward(tx);
        } else {
          await this.transactionsService.markAsInvalid(tx);
        }
      }

      for await (const tx of validTxs) {
        if (tx.rewardId) {
          await this.transactionsService.markAsValidWithReward(tx);
        } else {
          await this.transactionsService.markAsValid(tx);
        }
        await this.userBackersService.addUserBacker(
          tx.creatorId,
          tx.userId,
          tx.projectId,
          tx.projectTitle
        );
      }
    } catch (error) {
      console.error({
        error,
        message:
          'Exception error in TransactionValidatorService.validateTransactions',
      });
    }
  }

  private normalizeProjectId(projectId: string): string {
    return `${projectId.toLowerCase().replace(/-/g, '')}`;
  }

  private chunkString(input: string, length: number) {
    return input.match(new RegExp('.{1,' + length + '}', 'g'));
  }
}
