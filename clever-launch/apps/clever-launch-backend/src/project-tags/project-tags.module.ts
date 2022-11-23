import { Module } from '@nestjs/common';
import { DynamoModule } from '../dynamo/dynamo.module';
import { ProjectTagsController } from './project-tags.controller';
import { ProjectTagsRepository } from './project-tags.repository';
import { ProjectTagsService } from './project-tags.service';

@Module({
  imports: [DynamoModule],
  controllers: [ProjectTagsController],
  providers: [ProjectTagsService, ProjectTagsRepository],
})
export class ProjectTagsModule {}
