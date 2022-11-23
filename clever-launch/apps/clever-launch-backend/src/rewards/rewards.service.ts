import { Injectable } from '@nestjs/common';
import { RewardsRepository } from './rewards.repository';
import {
  Configuration,
  Project,
  Reward,
  RewardStatus,
} from '@clever-launch/data';
import { RewardNotFoundException } from './exceptions/reward-not-found.exception';
import { RewardHasBeenPurchasedException } from './exceptions/reward-has-been-purchased.exception';
import { ProjectsService } from '../projects/projects.service';
import { CreateRewardInputDto } from './dtos/create-reward-input.dto';
import { UsersService } from '../users/users.service';
import { UserNotOwnProjectException } from '../projects/exceptions/user-not-own-project.exception';
import { ChainService } from '../chain/chain.service';
import { ProjectNotFoundException } from '../projects/exceptions/project-not-found.exception';
import { UpdateRewardInputDto } from './dtos/update-reward-input.dto';
import { getUtcTimestamp } from '../utils/date-time';
import { v4 as uuid } from 'uuid';
import { TooManyRewardException } from './exceptions/too-many-reward.exception';
import { OnlyOwnerCanUpdateRewardException } from './exceptions/only-owner-can-update-reward.exception';

@Injectable()
export class RewardsService {
  constructor(
    private readonly rewardsRepository: RewardsRepository,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
    private readonly chainService: ChainService
  ) {}

  async getProjectRewards(projectId: string): Promise<Reward[]> {
    return this.rewardsRepository.getProjectRewards(projectId);
  }

  async createRewards(
    userId: string,
    createRewardDto: CreateRewardInputDto
  ): Promise<Reward> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    await this.validateUserAndProject(
      normalizedUserId,
      createRewardDto.projectId
    );

    const {
      projectId,
      title,
      totalAmount,
      price,
      description,
      estDeliveryMonth,
      estDeliveryYear,
      deliveryNote,
      rewardType,
    } = createRewardDto;
    const id = uuid();
    await this.validateReward(projectId);

    await this.rewardsRepository.createReward({
      id,
      projectId,
      createdAt: getUtcTimestamp(),
      title,
      totalAmount,
      amountLeft: totalAmount,
      price,
      description,
      estDeliveryMonth,
      estDeliveryYear,
      rewardType,
      deliveryNote,
      rewardStatus: RewardStatus.Available,
    });
    return this.getRewardOrThrow(id);
  }

  async removeReward(userId: string, rewardId: string): Promise<void> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);

    const reward = await this.getRewardOrThrow(rewardId);
    await this.validateUserAndProject(normalizedUserId, reward.projectId);

    if (reward.amountLeft !== reward.totalAmount) {
      throw new RewardHasBeenPurchasedException();
    }

    await this.rewardsRepository.removeReward(rewardId, reward.amountLeft);
  }

  private async validateReward(projectId: string) {
    const rewards = await this.rewardsRepository.getProjectRewards(projectId);
    if (rewards.length >= Configuration.MAX_REWARD_AVAILABLE) {
      throw new TooManyRewardException();
    }
  }

  private async validateUserAndProject(userId: string, projectId: string) {
    await this.usersService.getUserOrThrow(userId);
    const pendingProject = await this.projectsService.getPendingProjectByUserId(
      userId
    );
    const project = await this.projectsService.getProject(projectId);
    if (!project && !pendingProject) {
      throw new ProjectNotFoundException();
    }
    if (
      (project && project.creatorId !== userId) ||
      (pendingProject && pendingProject.creatorId !== userId)
    ) {
      throw new UserNotOwnProjectException();
    }
  }

  private async hasRewardOwnership(
    projectId: string,
    userId: string
  ): Promise<boolean> {
    const pendingProject = await this.projectsService.getPendingProjectByUserId(
      userId
    );
    let project: Project | undefined = undefined;
    if (!pendingProject) {
      project = await this.projectsService.getProjectOrThrow(projectId);
    }

    return project?.creatorId === userId;
  }

  async updateReward(
    userId: string,
    payload: UpdateRewardInputDto
  ): Promise<Reward> {
    const {
      id,
      title,
      totalAmount,
      price,
      description,
      estDeliveryMonth,
      estDeliveryYear,
      deliveryNote,
      rewardType,
    } = payload;
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);

    const reward = await this.getRewardOrThrow(id);

    if (!this.hasRewardOwnership(reward.projectId, normalizedUserId)) {
      throw new OnlyOwnerCanUpdateRewardException();
    }

    const timestamp = getUtcTimestamp();
    const updatedReward: Reward = {
      ...reward,
      updatedAt: timestamp,
      title: title ?? reward.title,
      totalAmount: totalAmount ?? reward.totalAmount,
      price: price ?? reward.price,
      description: description ?? reward.description,
      estDeliveryMonth: estDeliveryMonth ?? reward.estDeliveryMonth,
      estDeliveryYear: estDeliveryYear ?? reward.estDeliveryYear,
      deliveryNote: deliveryNote ?? reward.deliveryNote,
      rewardType: rewardType ?? reward.rewardType,
    };

    await this.rewardsRepository.updateReward(updatedReward);
    return this.getRewardOrThrow(id);
  }

  async getReward(rewardId: string): Promise<Reward | undefined> {
    return this.rewardsRepository.getReward(rewardId);
  }

  async getRewardOrThrow(rewardId: string): Promise<Reward> {
    const reward = await this.getReward(rewardId);
    if (!reward) {
      throw new RewardNotFoundException();
    }
    return reward;
  }
}
