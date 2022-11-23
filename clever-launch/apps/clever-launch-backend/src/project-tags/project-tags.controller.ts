import { Controller, Get } from '@nestjs/common';
import { ProjectTagsService } from './project-tags.service';
import { ProjectTag } from '@clever-launch/data';
import { ProjectTagDto } from './dtos/project-tag.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('project-tags')
@ApiTags('Project tags')
export class ProjectTagsController {
  constructor(private readonly projectTagsService: ProjectTagsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ProjectTagDto,
    isArray: true,
    description: 'Returns project tags',
  })
  async getProjectTags(): Promise<ProjectTag[]> {
    return this.projectTagsService.getProjectTags();
  }
}
