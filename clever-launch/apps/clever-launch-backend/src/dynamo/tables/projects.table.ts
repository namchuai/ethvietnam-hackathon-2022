import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ProjectIndex } from '@clever-launch/data';
import { PROJECT_TABLE } from '../../constants';

// TODO: Project only things which is needed
export const projectsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: PROJECT_TABLE,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'scannable', AttributeType: 'S' },
    { AttributeName: 'status', AttributeType: 'S' },
    { AttributeName: 'creatorId', AttributeType: 'S' },
    { AttributeName: 'featuredPoint', AttributeType: 'N' },
    { AttributeName: 'createdAt', AttributeType: 'N' },
    { AttributeName: 'approvedAt', AttributeType: 'N' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: ProjectIndex.FeaturedPointIndex,
      KeySchema: [
        { AttributeName: 'scannable', KeyType: 'HASH' },
        { AttributeName: 'featuredPoint', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: ProjectIndex.MyProjectIndex,
      KeySchema: [
        { AttributeName: 'creatorId', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: ProjectIndex.ApprovedAtIndex,
      KeySchema: [
        { AttributeName: 'scannable', KeyType: 'HASH' },
        { AttributeName: 'approvedAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: ProjectIndex.StatusApprovedAtIndex,
      KeySchema: [
        { AttributeName: 'status', KeyType: 'HASH' },
        { AttributeName: 'approvedAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: ProjectIndex.StatusCreatedAtIndex,
      KeySchema: [
        { AttributeName: 'status', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: ProjectIndex.UserProjectStatusIndex,
      KeySchema: [
        { AttributeName: 'creatorId', KeyType: 'HASH' },
        { AttributeName: 'status', KeyType: 'RANGE' },
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

export const projectsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: PROJECT_TABLE,
};
