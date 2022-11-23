import { CreateTableCommandInput, DeleteTableCommandInput } from '@aws-sdk/client-dynamodb';
import { REWARD_LOCK_TABLE } from '../../constants';

export const rewardLocksCreateTableCommandInput: CreateTableCommandInput = {
  TableName: REWARD_LOCK_TABLE,
  KeySchema: [{ AttributeName: 'transactionHash', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'transactionHash', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const rewardLocksDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: REWARD_LOCK_TABLE,
};