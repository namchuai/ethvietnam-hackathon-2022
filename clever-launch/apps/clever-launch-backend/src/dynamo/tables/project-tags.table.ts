import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { PROJECT_TAG_TABLE } from '../../constants';

export const projectTagsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PROJECT_TAG_TABLE,
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

export const projectTagsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PROJECT_TAG_TABLE,
};
