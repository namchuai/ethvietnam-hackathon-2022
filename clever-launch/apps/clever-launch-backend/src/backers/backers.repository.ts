import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Backer } from '@clever-launch/data';
import { BACKER_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';

@Injectable()
export class BackersRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getBackers(): Promise<Backer[]> {
    const result = await this.databaseService.scan({
      TableName: BACKER_TABLE,
    });
    return parseArray<Backer>(result.Items);
  }
}
