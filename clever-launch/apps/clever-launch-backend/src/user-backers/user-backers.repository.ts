import { Injectable } from '@nestjs/common';
import { UserBacker } from '@clever-launch/data';
import { DynamoService } from '../dynamo/dynamo.service';
import { marshall } from '@aws-sdk/util-dynamodb';
import { USER_BACKER_TABLE, PROJECT_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';

@Injectable()
export class UserBackersRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async addUserBacker(item: UserBacker): Promise<void> {
    await this.dynamoService.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: USER_BACKER_TABLE,
            Item: marshall(item),
            ConditionExpression:
              'attribute_not_exists(userId) AND attribute_not_exists(projectId)',
          },
        },
        {
          Update: {
            TableName: PROJECT_TABLE,
            Key: marshall({ id: item.projectId }),
            UpdateExpression: 'ADD backerCount :inc',
            ExpressionAttributeValues: marshall({ ':inc': 1 }),
          },
        },
      ],
    });
  }

  async getUserBackers(userId: string): Promise<UserBacker[]> {
    const ret = await this.dynamoService.query({
      TableName: USER_BACKER_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ScanIndexForward: true,
      ExpressionAttributeValues: marshall({ ':userId': userId }),
    });
    return parseArray<UserBacker>(ret.Items);
  }
}
