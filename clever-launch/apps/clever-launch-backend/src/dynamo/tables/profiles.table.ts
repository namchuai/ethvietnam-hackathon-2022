import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { PROFILE_TABLE } from '../../constants';

export const profilesCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PROFILE_TABLE,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const profilesDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PROFILE_TABLE,
};
