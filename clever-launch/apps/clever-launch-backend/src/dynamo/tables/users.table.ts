import { CreateTableCommandInput, DeleteTableCommandInput } from '@aws-sdk/client-dynamodb';
import { USER_TABLE } from '../../constants';

export const usersCreateTableCommandInput: CreateTableCommandInput = {
  TableName: USER_TABLE,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const usersDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: USER_TABLE,
};
