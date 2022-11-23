import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { EMAIL_SUBSCRIBER_TABLE } from '../../constants';

export const emailSubscribersCreateTableCommandInput: CreateTableCommandInput =
  {
    TableName: EMAIL_SUBSCRIBER_TABLE,
    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

export const emailSubscribersDeleteTableCommandInput: DeleteTableCommandInput =
  {
    TableName: EMAIL_SUBSCRIBER_TABLE,
  };
