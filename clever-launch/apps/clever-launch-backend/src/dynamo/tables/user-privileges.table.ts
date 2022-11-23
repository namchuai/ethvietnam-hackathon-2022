import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { PRIVILEGE_TABLE } from '../../constants';

export const userPrivilegesCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PRIVILEGE_TABLE,
  KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const userPrivilegesDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PRIVILEGE_TABLE,
};
