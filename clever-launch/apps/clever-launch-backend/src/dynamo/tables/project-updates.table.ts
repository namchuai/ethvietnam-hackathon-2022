import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ProjectUpdateIndex } from '@clever-launch/data';
import { PROJECT_UPDATE_TABLE } from '../../constants';

export const projectUpdatesCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PROJECT_UPDATE_TABLE,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'projectId', AttributeType: 'S' },
    { AttributeName: 'createdAt', AttributeType: 'N' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: ProjectUpdateIndex.ProjectIndex,
      KeySchema: [
        { AttributeName: 'projectId', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
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

export const projectUpdatesDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PROJECT_UPDATE_TABLE,
};
