import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { BACKER_TABLE } from '../../constants';

export const backersCreateTableCommandInput: CreateTableCommandInput = {
  TableName: BACKER_TABLE,
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
    { AttributeName: 'position', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'position', AttributeType: 'N' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const backersDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: BACKER_TABLE,
};
