import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getUtcTimestamp } from '../utils/date-time';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectWatchmanService {
  constructor(private readonly projectsService: ProjectsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateProjectStatus() {
    const validatedProjects = await this.projectsService.getValidatedProjects();

    if (!validatedProjects.length) {
      return;
    }

    const currentTimestamp = getUtcTimestamp();
    for (const project of validatedProjects) {
      if (project.endAt && currentTimestamp >= project.endAt) {
        this.projectsService.markProjectAsFinished(project).catch((err) => {
          console.error(err);
        });
      }
    }
  }
}
