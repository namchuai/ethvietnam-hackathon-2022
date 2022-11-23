import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { MEMBER_TABLE } from '../../constants';

export const membersCreateTableCommandInput: CreateTableCommandInput = {
  TableName: MEMBER_TABLE,
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

export const membersDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: MEMBER_TABLE,
};
