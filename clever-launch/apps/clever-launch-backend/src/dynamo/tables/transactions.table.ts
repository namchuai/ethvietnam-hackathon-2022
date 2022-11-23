import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { CLTransactionIndex } from '@clever-launch/data';
import { TRANSACTION_TABLE } from '../../constants';

export const transactionsCreateTableCommandInput: CreateTableCommandInput = {
  TableName: TRANSACTION_TABLE,
  KeySchema: [{ AttributeName: 'transactionHash', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'transactionHash', AttributeType: 'S' },
    { AttributeName: 'projectId', AttributeType: 'S' },
    { AttributeName: 'transactionStatus', AttributeType: 'S' },
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'createdAt', AttributeType: 'N' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: CLTransactionIndex.ProjectTransactionIndex,
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
    {
      IndexName: CLTransactionIndex.TransactionStatusIndex,
      KeySchema: [
        { AttributeName: 'transactionStatus', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    {
      IndexName: CLTransactionIndex.UserTransactionIndex,
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
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

export const transactionsDeleteTableCommandInput: DeleteTableCommandInput = {
  TableName: TRANSACTION_TABLE,
};
