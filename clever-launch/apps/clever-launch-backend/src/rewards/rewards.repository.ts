import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Reward, RewardIndex, RewardStatus } from '@clever-launch/data';
import { REWARD_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class RewardsRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getReward(id: string): Promise<Reward | undefined> {
    const ret = await this.databaseService.get({
      TableName: REWARD_TABLE,
      Key: { id: id },
      ConsistentRead: true,
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as Reward;
  }

  async getProjectRewards(projectId: string): Promise<Reward[]> {
    const ret = await this.databaseService.query({
      TableName: REWARD_TABLE,
      IndexName: RewardIndex.ProjectIndex,
      KeyConditionExpression: 'projectId = :projectId',
      ScanIndexForward: true,
      FilterExpression: 'rewardStatus <> :removed',
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
        ':removed': RewardStatus.Removed,
      }),
    });
    return parseArray<Reward>(ret.Items);
  }

  async updateReward(reward: Reward): Promise<void> {
    await this.databaseService.put({
      TableName: REWARD_TABLE,
      Item: reward,
    });
  }

  async createReward(reward: Reward): Promise<void> {
    await this.databaseService.put({
      TableName: REWARD_TABLE,
      Item: reward,
      ConditionExpression: 'attribute_not_exists(id)',
    });
  }

  async removeReward(rewardId: string, amountLeft: number): Promise<void> {
    await this.databaseService.delete({
      TableName: REWARD_TABLE,
      Key: { id: rewardId },
      ConditionExpression: 'totalAmount = :amountLeft',
      ExpressionAttributeValues: {
        ':amountLeft': amountLeft,
      },
    });
  }
}
