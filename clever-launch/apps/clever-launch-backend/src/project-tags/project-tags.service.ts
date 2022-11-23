import { Injectable } from '@nestjs/common';
import { ProjectTagsRepository } from './project-tags.repository';
import { ProjectTag } from '@clever-launch/data';

@Injectable()
export class ProjectTagsService {
  constructor(private readonly projectTagsRepository: ProjectTagsRepository) {}

  async getProjectTags(): Promise<ProjectTag[]> {
    return this.projectTagsRepository.getProjectTags();
  }
}
