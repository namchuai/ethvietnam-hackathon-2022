import { Injectable } from '@nestjs/common';
import { UserBackerProject } from '@clever-launch/data';
import { ChainService } from '../chain/chain.service';
import { UserBackersRepository } from './user-backers.repository';
import { ProjectsService } from '../projects/projects.service';
import { getUtcTimestamp } from '../utils/date-time';

@Injectable()
export class UserBackersService {
  constructor(
    private readonly chainService: ChainService,
    private readonly projectsService: ProjectsService,
    private readonly userBackersRepository: UserBackersRepository
  ) {}

  async getUserBackers(userId: string): Promise<UserBackerProject[]> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const userBackers = await this.userBackersRepository.getUserBackers(
      normalizedUserId
    );
    const ret: UserBackerProject[] = [];
    for (const userBacker of userBackers) {
      const project = await this.projectsService.getProject(
        userBacker.projectId
      );
      if (project) {
        ret.push({
          ...userBacker,
          project,
        });
      }
    }

    return ret;
  }

  async addUserBacker(
    userId: string,
    backerId: string,
    projectId: string,
    projectName: string
  ): Promise<void> {
    try {
      await this.userBackersRepository.addUserBacker({
        userId,
        backerId,
        projectId,
        projectName,
        createdAt: getUtcTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  }
}
