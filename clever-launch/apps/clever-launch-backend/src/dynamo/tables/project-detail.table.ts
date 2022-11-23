import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { PROJECT_DETAIL_TABLE } from '../../constants';

export const projectDetailCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PROJECT_DETAIL_TABLE,
  KeySchema: [{ AttributeName: 'projectId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'projectId', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const projectDetailDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PROJECT_DETAIL_TABLE,
};
