import { Injectable } from '@nestjs/common';
import { Member } from '@clever-launch/data';
import { DynamoService } from '../dynamo/dynamo.service';
import { MEMBER_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';

@Injectable()
export class MembersRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async getAllMembers(): Promise<Member[]> {
    const result = await this.dynamoService.scan({
      TableName: MEMBER_TABLE,
    });
    return parseArray<Member>(result.Items);
  }
}
