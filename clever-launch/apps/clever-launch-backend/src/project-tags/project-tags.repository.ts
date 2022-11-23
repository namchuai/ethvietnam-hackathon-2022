import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { ProjectTag } from '@clever-launch/data';
import { PROJECT_TAG_TABLE } from '../constants';
import { parseArray } from '../utils/dynamodb';

@Injectable()
export class ProjectTagsRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getProjectTags(): Promise<ProjectTag[]> {
    const result = await this.databaseService.scan({
      TableName: PROJECT_TAG_TABLE,
    });
    return parseArray<ProjectTag>(result.Items);
  }
}
