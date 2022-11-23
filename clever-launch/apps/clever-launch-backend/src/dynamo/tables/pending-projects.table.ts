import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { PendingProjectIndex } from '@clever-launch/data';
import { PENDING_PROJECT_TABLE } from '../../constants';

export const pendingProjectsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PENDING_PROJECT_TABLE,
  KeySchema: [{ AttributeName: 'creatorId', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'creatorId', AttributeType: 'S' },
    { AttributeName: 'projectId', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: PendingProjectIndex.ProjectIdIndex,
      KeySchema: [{ AttributeName: 'projectId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

export const pendingProjectsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PENDING_PROJECT_TABLE,
};
