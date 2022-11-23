import { Injectable } from '@nestjs/common';
import { Advisor } from '@clever-launch/data';
import { DynamoService } from '../dynamo/dynamo.service';
import { ADVISOR_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';

@Injectable()
export class AdvisorsRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getAllAdvisors(): Promise<Advisor[]> {
    const result = await this.databaseService.scan({
      TableName: ADVISOR_TABLE,
    });
    return parseArray<Advisor>(result.Items);
  }
}
