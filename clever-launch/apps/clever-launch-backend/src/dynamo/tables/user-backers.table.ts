import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { USER_BACKER_TABLE } from '../../constants';

export const userBackersCreateTableCommandInput: CreateTableCommandInput = {
  TableName: USER_BACKER_TABLE,
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' },
    { AttributeName: 'projectId', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'projectId', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const userBackersDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: USER_BACKER_TABLE,
};
