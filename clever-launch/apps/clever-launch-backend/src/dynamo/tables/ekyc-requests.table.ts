import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { EKYC_REQUEST_TABLE } from '../../constants';

export const ekycRequestsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: EKYC_REQUEST_TABLE,
  KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const ekycRequestsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: EKYC_REQUEST_TABLE,
};
