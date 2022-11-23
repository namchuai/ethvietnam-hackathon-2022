import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocument,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommandInput,
  ScanCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AWS_REGION } from '../constants';
import { createCommandInputs, deleteCommandInputs } from './tables';

@Injectable()
export class DynamoService {
  private docClient: DynamoDBDocumentClient;

  constructor(configService: ConfigService) {
    const credentials = configService.awsCredential.split(':');
    const client = new DynamoDBClient({
      credentials: {
        accessKeyId: credentials[0],
        secretAccessKey: credentials[1],
      },
      region: AWS_REGION,
    });
    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // false, by default.
      removeUndefinedValues: true,
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: false, // false, by default.
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false, // false, by default.
    };

    const translateConfig = { marshallOptions, unmarshallOptions };
    this.docClient = DynamoDBDocument.from(client, translateConfig);
  }

  async put(commandInput: PutCommandInput): Promise<void> {
    await this.docClient.send(new PutCommand(commandInput));
  }

  async get(commandInput: GetCommandInput) {
    return this.docClient.send(new GetCommand(commandInput));
  }

  async query(commandInput: QueryCommandInput) {
    return this.docClient.send(new QueryCommand(commandInput));
  }

  async update(commandInput: UpdateCommandInput) {
    return this.docClient.send(new UpdateCommand(commandInput));
  }

  async scan(commandInput: ScanCommandInput) {
    return this.docClient.send(new ScanCommand(commandInput));
  }

  async transactWrite(commandInput: TransactWriteItemsCommandInput) {
    return this.docClient.send(new TransactWriteItemsCommand(commandInput));
  }

  async delete(commandInput: DeleteCommandInput) {
    return this.docClient.send(new DeleteCommand(commandInput));
  }

  async createDefaultTables(): Promise<void> {
    for (const createCommandInput of createCommandInputs) {
      this.docClient.send(new CreateTableCommand(createCommandInput));
    }
  }

  async deleteDefaultTables(): Promise<void> {
    for (const deleteCommandInput of deleteCommandInputs) {
      this.docClient.send(new DeleteTableCommand(deleteCommandInput));
    }
  }
}
