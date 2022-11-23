import { Injectable } from '@nestjs/common';
import {
  CLTransaction,
  CLTransactionIndex,
  Reward,
  RewardLock,
  RewardLockStatus,
  TransactionStatus,
} from '@clever-launch/data';
import { DynamoService } from '../dynamo/dynamo.service';
import {
  PROJECT_TABLE,
  REWARD_LOCK_TABLE,
  REWARD_TABLE,
  TRANSACTION_TABLE,
} from '../constants';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { parseArray } from '../utils/dynamodb';
import { RewardNotFoundException } from '../rewards/exceptions/reward-not-found.exception';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async createTransaction(transaction: CLTransaction): Promise<void> {
    const { transactionHash, projectId, userId, rewardId, createdAt } =
      transaction;

    const transactItems: TransactWriteItem[] = [
      {
        Put: {
          TableName: TRANSACTION_TABLE,
          Item: marshall(transaction, { removeUndefinedValues: true }),
          ConditionExpression: 'attribute_not_exists(transactionHash)',
        },
      },
    ];

    if (rewardId) {
      const rewardLockItem: RewardLock = {
        transactionHash,
        rewardId,
        projectId,
        userId,
        rewardLockStatus: RewardLockStatus.Validating,
        createdAt: transaction.createdAt,
      };

      transactItems.push({
        Update: {
          TableName: REWARD_TABLE,
          Key: marshall({ id: rewardId }),
          ConditionExpression: 'amountLeft > :zero',
          UpdateExpression:
            'ADD amountLeft :amount' + ' SET updatedAt = :updatedAt',
          ExpressionAttributeValues: marshall({
            ':zero': 0,
            ':amount': -1,
            ':updatedAt': createdAt,
          }),
        },
      });
      transactItems.push({
        Put: {
          TableName: REWARD_LOCK_TABLE,
          Item: marshall(rewardLockItem),
          ConditionExpression: 'attribute_not_exists(transactionHash)',
        },
      });
    }

    await this.databaseService.transactWrite({
      TransactItems: transactItems,
    });
  }

  private async getRewardConsistent(rewardId: string): Promise<Reward> {
    const ret = await this.databaseService.get({
      TableName: REWARD_TABLE,
      Key: { id: rewardId },
      ConsistentRead: true,
    });
    if (!ret.Item) {
      throw new RewardNotFoundException();
    }
    return ret.Item as Reward;
  }

  async getTransactionsByStatus(
    txStatus: TransactionStatus
  ): Promise<CLTransaction[]> {
    const ret = await this.databaseService.query({
      TableName: TRANSACTION_TABLE,
      IndexName: CLTransactionIndex.TransactionStatusIndex,
      ScanIndexForward: true,
      KeyConditionExpression: 'transactionStatus = :txStatus',
      ExpressionAttributeValues: marshall({ ':txStatus': txStatus }),
    });
    return parseArray<CLTransaction>(ret.Items);
  }

  async getTransaction(id: string): Promise<CLTransaction | undefined> {
    const ret = await this.databaseService.get({
      TableName: TRANSACTION_TABLE,
      Key: { transactionHash: id },
    });
    if (!ret.Item) {
      return undefined;
    }

    return ret.Item as CLTransaction;
  }

  async getUserTransactions(userId: string): Promise<CLTransaction[]> {
    const ret = await this.databaseService.query({
      TableName: TRANSACTION_TABLE,
      IndexName: CLTransactionIndex.UserTransactionIndex,
      KeyConditionExpression: 'userId = :userId',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({
        ':userId': userId,
      }),
    });
    return parseArray<CLTransaction>(ret.Items);
  }

  async getProjectTransactions(projectId: string): Promise<CLTransaction[]> {
    const ret = await this.databaseService.query({
      TableName: TRANSACTION_TABLE,
      IndexName: CLTransactionIndex.ProjectTransactionIndex,
      KeyConditionExpression: 'projectId = :projectId',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
      }),
    });
    return parseArray<CLTransaction>(ret.Items);
  }

  async markTransactionAsValid(
    txHash: string,
    projectId: string,
    amount: number,
    updatedAt: number
  ): Promise<void> {
    await this.databaseService.transactWrite({
      TransactItems: [
        {
          Update: {
            TableName: TRANSACTION_TABLE,
            Key: marshall({ transactionHash: txHash }),
            ConditionExpression: 'transactionStatus = :submitted',
            UpdateExpression:
              'SET transactionStatus = :valid' + ', updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':valid': TransactionStatus.Valid,
              ':submitted': TransactionStatus.Submitted,
              ':updatedAt': updatedAt,
            }),
          },
        },
        {
          Update: {
            TableName: PROJECT_TABLE,
            Key: marshall({ id: projectId }),
            UpdateExpression:
              'ADD fundedAmount :amount' + ' SET updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':amount': amount,
              ':updatedAt': updatedAt,
            }),
          },
        },
      ],
    });
  }

  async markTransactionAsValidWithReward(
    txHash: string,
    projectId: string,
    amount: number,
    updatedAt: number
  ): Promise<void> {
    await this.databaseService.transactWrite({
      TransactItems: [
        {
          Update: {
            TableName: TRANSACTION_TABLE,
            Key: marshall({ transactionHash: txHash }),
            ConditionExpression: 'transactionStatus = :submitted',
            UpdateExpression:
              'SET transactionStatus = :valid' + ', updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':valid': TransactionStatus.Valid,
              ':submitted': TransactionStatus.Submitted,
              ':updatedAt': updatedAt,
            }),
          },
        },
        {
          Update: {
            TableName: REWARD_LOCK_TABLE,
            Key: marshall({ transactionHash: txHash }),
            ConditionExpression: 'rewardLockStatus = :validating',
            UpdateExpression:
              'SET rewardLockStatus = :success' + ', updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':success': RewardLockStatus.Success,
              ':validating': RewardLockStatus.Validating,
              ':updatedAt': updatedAt,
            }),
          },
        },
        {
          Update: {
            TableName: PROJECT_TABLE,
            Key: marshall({ id: projectId }),
            UpdateExpression:
              'ADD fundedAmount :amount' + ' SET updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':amount': amount,
              ':updatedAt': updatedAt,
            }),
          },
        },
      ],
    });
  }

  async markTransactionAsInvalid(
    txHash: string,
    invalidReason: string,
    updatedAt: number
  ): Promise<void> {
    await this.databaseService.update({
      TableName: TRANSACTION_TABLE,
      Key: { transactionHash: txHash },
      ConditionExpression: 'transactionStatus = :submitted',
      UpdateExpression:
        'SET transactionStatus = :invalid' +
        ', updatedAt = :updatedAt' +
        ', invalidReason = :invalidReason',
      ExpressionAttributeValues: {
        ':invalid': TransactionStatus.Invalid,
        ':submitted': TransactionStatus.Submitted,
        ':invalidReason': invalidReason,
        ':updatedAt': updatedAt,
      },
    });
  }

  async markTransactionAsInvalidWithReward(
    txHash: string,
    rewardId: string,
    invalidReason: string,
    updatedAt: number
  ): Promise<void> {
    await this.databaseService.transactWrite({
      TransactItems: [
        {
          Update: {
            TableName: TRANSACTION_TABLE,
            Key: marshall({ transactionHash: txHash }),
            ConditionExpression: 'transactionStatus = :submitted',
            UpdateExpression:
              'SET transactionStatus = :invalid' +
              ', updatedAt = :updatedAt' +
              ', invalidReason = :invalidReason',
            ExpressionAttributeValues: marshall({
              ':invalid': TransactionStatus.Invalid,
              ':submitted': TransactionStatus.Submitted,
              ':invalidReason': invalidReason,
              ':updatedAt': updatedAt,
            }),
          },
        },
        {
          Update: {
            TableName: REWARD_LOCK_TABLE,
            Key: marshall({ transactionHash: txHash }),
            ConditionExpression: 'rewardLockStatus = :validating',
            UpdateExpression:
              'SET rewardLockStatus = :reverted' + ', updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':reverted': RewardLockStatus.Reverted,
              ':validating': RewardLockStatus.Validating,
              ':updatedAt': updatedAt,
            }),
          },
        },
        {
          Update: {
            TableName: REWARD_TABLE,
            Key: marshall({ id: rewardId }),
            UpdateExpression:
              'ADD amountLeft :inc' + ', updatedAt = :updatedAt',
            ExpressionAttributeValues: marshall({
              ':inc': 1,
              ':updatedAt': updatedAt,
            }),
          },
        },
      ],
    });
  }
}
