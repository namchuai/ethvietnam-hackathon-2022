import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { RewardIndex } from '@clever-launch/data';
import { REWARD_TABLE } from '../../constants';

export const rewardsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: REWARD_TABLE,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'projectId', AttributeType: 'S' },
    { AttributeName: 'createdAt', AttributeType: 'N' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: RewardIndex.ProjectIndex,
      KeySchema: [
        { AttributeName: 'projectId', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const rewardsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: REWARD_TABLE,
};
