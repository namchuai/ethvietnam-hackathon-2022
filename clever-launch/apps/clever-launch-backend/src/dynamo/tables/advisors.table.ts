import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ADVISOR_TABLE } from '../../constants';

export const advisorsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: ADVISOR_TABLE,
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

export const advisorsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: ADVISOR_TABLE,
};
