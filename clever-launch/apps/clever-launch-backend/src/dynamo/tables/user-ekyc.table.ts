import { CreateTableCommandInput, DeleteTableCommandInput } from '@aws-sdk/client-dynamodb';
import { USER_EKYC_TABLE } from '../../constants';

export const userEkycCreateTableCommandInput: CreateTableCommandInput = {
  TableName: USER_EKYC_TABLE,
  KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const userEkycDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: USER_EKYC_TABLE,
};