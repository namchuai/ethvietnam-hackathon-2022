import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CLPrivilege,
  EkycStatus,
  FundRaisingMethod,
  IntroType,
  PendingProject,
  Profile,
  Project,
  ProjectDetail,
  ProjectStatus,
  ProjectUpdate,
  ProjectUpdateStatus,
  User,
} from '@clever-launch/data';
import { ProjectsRepository } from './projects.repository';
import { StorageService } from '../storage/storage.service';
import { ALL_PROJECT_LIMIT, FEATURED_PROJECT_LIMIT } from '../constants';
import { PaginatedArray } from '../utils/dynamodb';
import { ProjectNotFoundException } from './exceptions/project-not-found.exception';
import { UsersService } from '../users/users.service';
import { UserNotOwnProjectException } from './exceptions/user-not-own-project.exception';
import { CreateProjectInputDto } from './dtos/create-project-input.dto';
import { PendingProjectResponseDto } from './dtos/pending-project-response.dto';
import { v4 as uuid } from 'uuid';
import { PendingProjectNotFoundException } from './exceptions/pending-project-not-found.exception';
import { getUtcTimestamp } from '../utils/date-time';
import { PendingProjectInputDto } from './dtos/pending-project-input.dto';
import { ChainService } from '../chain/chain.service';
import { PendingProjectUpdateEmptyException } from './exceptions/pending-project-update-empty.exception';
import { UserHasProjectInReviewException } from './exceptions/user-has-project-in-review.exception';
import { InReviewProjectNotFoundException } from './exceptions/in-review-project-not-found.exception';
import { CreateProjectUpdateInputDto } from './dtos/create-project-update-input.dto';
import { CreateProjectUpdateFailedException } from './exceptions/create-project-update-failed.exception';
import { ProjectStoryNotFoundException } from './exceptions/project-story-not-found.exception';
import { PrivilegesService } from '../privileges/privileges.service';
import { UserDoNotHavePermissionException } from '../privileges/exceptions/user-do-not-have-permission.exception';
import { UserMustEkycException } from './exceptions/user-must-ekyc.exception';
import { UserDoesNotHaveValidName } from './exceptions/user-does-not-have-valid-name.exception';
import { ProjectIsNotWaitingForValidationException } from './exceptions/project-is-not-waiting-for-validation.exception';
import { SmartContractService } from '../smart-contract/smart-contract.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
    private readonly chainService: ChainService,
    private readonly privilegesService: PrivilegesService,
    private readonly smartContractService: SmartContractService
  ) {}

  async getFeaturedProjects(
    limit: number | undefined,
    lastProjectId: string | undefined,
    featuredPoint: number | undefined
  ): Promise<PaginatedArray<Project>> {
    const featuredPointInNumber = Number(featuredPoint);
    const limitInNumber = Number(limit ?? FEATURED_PROJECT_LIMIT);

    const featuredProjects: PaginatedArray<Project> = { data: [] };
    if (lastProjectId && featuredPointInNumber) {
      featuredProjects.lastEvaluatedKey = {
        id: lastProjectId,
        scannable: 'scannable',
        featuredPoint: featuredPointInNumber,
      };
    }

    do {
      const projects = await this.projectsRepository.getFeaturedProjects(
        limitInNumber,
        featuredProjects.lastEvaluatedKey
      );
      if (projects.data.length) {
        featuredProjects.data = featuredProjects.data.concat(projects.data);
      }
      featuredProjects.lastEvaluatedKey = projects.lastEvaluatedKey;
    } while (
      featuredProjects.data.length < limitInNumber &&
      featuredProjects.lastEvaluatedKey
    );

    return featuredProjects;
  }

  async getAllProjects(
    limit: number | undefined,
    sortType: string | undefined,
    lastProjectId: string | undefined,
    lastProjectCreatedAt: number | undefined
  ): Promise<PaginatedArray<Project>> {
    if (!sortType) {
      sortType = 'newest_first';
    }
    let newestFirst = true;
    if (sortType !== 'newest_first' && sortType !== 'oldest_first') {
      throw new BadRequestException(
        'Only accept sortType to be newest_first or oldest_first'
      );
    }

    if (sortType === 'oldest_first') {
      newestFirst = false;
    }

    let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;
    if (lastProjectId && lastProjectCreatedAt) {
      lastEvaluatedKey = {
        id: lastProjectId,
        createdAt: Number(lastProjectCreatedAt),
        scannable: 'scannable',
      };
    }
    return this.projectsRepository.getProjects(
      Number(limit ?? ALL_PROJECT_LIMIT),
      newestFirst,
      lastEvaluatedKey
    );
  }

  async getUserProjects(
    userId: string,
    limit: number | undefined,
    lastProjectId: string | undefined,
    lastProjectCreatedAt: number | undefined
  ): Promise<PaginatedArray<Project>> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;
    if (lastProjectId && lastProjectCreatedAt) {
      lastEvaluatedKey = {
        id: lastProjectId,
        createdAt: Number(lastProjectCreatedAt),
        creatorId: normalizedUserId,
      };
    }
    return this.projectsRepository.getUserProjects(
      normalizedUserId,
      Number(limit ?? ALL_PROJECT_LIMIT),
      lastEvaluatedKey
    );
  }

  async createProject(
    userId: string,
    createProjectInput: CreateProjectInputDto
  ): Promise<Project> {
    const {
      projectId: id,
      title,
      subTitle,
      introType,
      introUrl,
      fundRaisingMethod,
      fundingGoal,
      durationInDay,
      tags,
      walletAddress,
      contactEmail,
      pitchDeckUrl,
      story,
    } = createProjectInput;

    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const normalizedWalletAddress =
      this.chainService.normalizeUserInputEthAddress(walletAddress);
    const user = await this.usersService.getUserOrThrow(userId);
    if (user.id !== normalizedUserId) {
      throw new UserNotOwnProjectException();
    }

    if (
      user.eKycStatus !== EkycStatus.InReview &&
      user.eKycStatus !== EkycStatus.Successful
    ) {
      throw new UserMustEkycException();
    }

    const inReviewProject = await this.getInReviewProject(normalizedUserId);
    if (inReviewProject) {
      throw new UserHasProjectInReviewException();
    }
    const profile = await this.usersService.getProfile(normalizedUserId);
    const timestamp = getUtcTimestamp();

    const creatorName = this.getCreatorName(user, profile);

    if (fundRaisingMethod === FundRaisingMethod.LookingForInvestors) {
      if (!pitchDeckUrl) {
        throw new BadRequestException(
          'Pitch deck url cannot be null for invest project'
        );
      }
      // TODO: clean this duplicated code
      const project: Project = {
        creatorId: normalizedUserId,
        id,
        title,
        subTitle,
        introType,
        introUrl,
        fundRaisingMethod,
        tags,
        walletAddress: normalizedWalletAddress,
        contactEmail,
        createdAt: timestamp,
        status: ProjectStatus.Created,
        featuredPoint: 0,
        scannable: 'scannable',
        fundedAmount: 0,
        creatorFirstName: user.firstName,
        creatorLastName: user.lastName,
        creatorProfileName: creatorName,
        backerCount: 0,
        pitchDeckUrl,
      };
      const projectDetail: ProjectDetail = {
        projectId: id,
        story: story,
      };
      return this.storeNewProject(project, projectDetail);
    }

    if (!fundingGoal) {
      throw new BadRequestException(
        'Funding goal cannot be null for donation project'
      );
    }

    if (!durationInDay) {
      throw new BadRequestException(
        'Duration cannot be null for donation project'
      );
    }

    const project: Project = {
      creatorId: normalizedUserId,
      id,
      title,
      subTitle,
      introType,
      introUrl,
      fundRaisingMethod,
      fundingGoal,
      durationInDay,
      tags,
      walletAddress: normalizedWalletAddress,
      contactEmail,
      createdAt: timestamp,
      status: ProjectStatus.Created,
      featuredPoint: 0,
      scannable: 'scannable',
      fundedAmount: 0,
      creatorFirstName: user.firstName,
      creatorLastName: user.lastName,
      creatorProfileName: creatorName,
      backerCount: 0,
    };
    const projectDetail: ProjectDetail = {
      projectId: id,
      story: story,
    };

    return this.storeNewProject(project, projectDetail);
  }

  private getCreatorName(user: User, profile?: Profile): string {
    if (profile && profile.name) {
      return profile.name;
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim();
    if (!fullName.length) {
      throw new UserDoesNotHaveValidName();
    }
    return fullName;
  }

  private async storeNewProject(
    project: Project,
    projectDetail: ProjectDetail
  ): Promise<Project> {
    await this.projectsRepository.createProject(project);
    await this.projectsRepository.createProjectDetail(projectDetail);

    const pendingProject = await this.projectsRepository.getPendingProject(
      project.creatorId
    );

    if (pendingProject) {
      await this.projectsRepository.deletePendingProject(project.creatorId);
    }

    return this.getProjectOrThrow(project.id);
  }

  async uploadProjectPitchDeck(
    userId: string,
    projectId: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    await this.validateUserAndProject(userId, projectId);
    return this.storageService.uploadProjectPitchDeck(
      projectId,
      buffer,
      mimeType
    );
  }

  async uploadMedium(
    userId: string,
    projectId: string,
    buffer: Buffer
  ): Promise<string> {
    if (!projectId || !projectId.length) {
      // TODO: validate uuid
      throw new BadRequestException("ProjectId can't be null or empty");
    }

    await this.validateUserAndProject(userId, projectId);
    return this.storageService.uploadProjectMedium(projectId, buffer);
  }

  private async validateUserAndProject(userId: string, projectId: string) {
    const user = await this.usersService.getUserOrThrow(userId);
    const project = await this.getProject(projectId);
    const pendingProject = await this.getPendingProjectByProjectId(projectId);
    if (!project && !pendingProject) {
      throw new ProjectNotFoundException();
    }
    if (project && project.creatorId !== user.id) {
      throw new UserNotOwnProjectException();
    }
    if (pendingProject && pendingProject.creatorId !== user.id) {
      throw new UserNotOwnProjectException();
    }
  }

  async getProject(projectId: string): Promise<Project | undefined> {
    return this.projectsRepository.getProject(projectId);
  }

  async getProjectOrThrow(id: string): Promise<Project> {
    const project = await this.getProject(id);
    if (!project) {
      throw new ProjectNotFoundException();
    }
    return project;
  }

  async createPendingProject(
    userId: string
  ): Promise<PendingProjectResponseDto> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    await this.usersService.getUserOrThrow(normalizedUserId);

    const pendingProject = await this.getPendingProjectByUserId(
      normalizedUserId
    );
    if (pendingProject) {
      return pendingProject;
    }

    const item: PendingProject = {
      creatorId: normalizedUserId,
      projectId: uuid(),
      introType: IntroType.Image,
      fundRaisingMethod: FundRaisingMethod.LookingForDonors,
      createdAt: getUtcTimestamp(),
    };

    await this.projectsRepository.createPendingProject(item);
    return this.getPendingProjectOrThrow(normalizedUserId);
  }

  async getPendingProjectOrThrow(
    userId: string
  ): Promise<PendingProjectResponseDto> {
    const pendingProject = await this.getPendingProjectByUserId(userId);
    if (!pendingProject) {
      throw new PendingProjectNotFoundException();
    }

    return pendingProject;
  }

  async getPendingProjectByUserId(
    userId: string
  ): Promise<PendingProject | undefined> {
    return this.projectsRepository.getPendingProject(userId);
  }

  async getPendingProjectByProjectId(
    projectId: string
  ): Promise<PendingProject | undefined> {
    return this.projectsRepository.getPendingProjectByProjectId(projectId);
  }

  async updatePendingProject(
    userId: string,
    body: PendingProjectInputDto
  ): Promise<PendingProjectResponseDto> {
    if (Object.keys(body).length === 0) {
      throw new PendingProjectUpdateEmptyException();
    }

    const pendingProject = await this.projectsRepository.getPendingProject(
      userId
    );
    if (!pendingProject) {
      throw new PendingProjectNotFoundException();
    }

    const timestamp = getUtcTimestamp();
    const {
      title,
      subTitle,
      tags,
      fundingGoal,
      durationInDay,
      story,
      walletAddress: inputWalletAddress,
      contactEmail,
      introType,
      introUrl,
      fundRaisingMethod,
      pitchDeckUrl,
    } = body;

    let walletAddress: string | undefined = inputWalletAddress;
    if (inputWalletAddress) {
      walletAddress =
        this.chainService.normalizeUserInputEthAddress(inputWalletAddress);
    }

    const updatedPendingProject: PendingProject = {
      ...pendingProject,
      updatedAt: timestamp,
      title: title ?? pendingProject.title,
      subTitle: subTitle ?? pendingProject.subTitle,
      introType: introType ?? pendingProject.introType,
      introUrl: introUrl ?? pendingProject.introUrl,
      fundRaisingMethod: fundRaisingMethod ?? pendingProject.fundRaisingMethod,
      fundingGoal: fundingGoal ?? pendingProject.fundingGoal,
      durationInDay: durationInDay ?? pendingProject.durationInDay,
      pitchDeckUrl: pitchDeckUrl ?? pendingProject.pitchDeckUrl,
      tags: tags ?? pendingProject.tags,
      story: story ?? pendingProject.story,
      walletAddress: walletAddress ?? pendingProject.walletAddress,
      contactEmail: contactEmail ?? pendingProject.contactEmail,
    };

    await this.projectsRepository.updatePendingProject(updatedPendingProject);
    return this.getPendingProjectOrThrow(userId);
  }

  private async getInReviewProject(
    userId: string
  ): Promise<Project | undefined> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const projects = await this.projectsRepository.getUserProjectsByStatus(
      normalizedUserId,
      ProjectStatus.Created
    );
    if (projects.length === 0) {
      return undefined;
    }
    return projects[0];
  }

  async getInReviewProjectOrThrow(userId: string): Promise<Project> {
    const inReviewProject = await this.getInReviewProject(userId);
    if (!inReviewProject) {
      throw new InReviewProjectNotFoundException();
    }
    return inReviewProject;
  }

  async createProjectUpdate(
    userId: string,
    payload: CreateProjectUpdateInputDto
  ): Promise<ProjectUpdate> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const { projectId, content } = payload;

    const project = await this.projectsRepository.getProjectOrThrow(projectId);
    const user = await this.usersService.getUserOrThrow(normalizedUserId);
    if (project.creatorId !== user.id) {
      throw new UserNotOwnProjectException();
    }

    const profile = await this.usersService.getProfile(normalizedUserId);
    const creatorName = profile?.name ?? `${user.lastName} ${user.firstName}`;
    const latestUpdate =
      await this.projectsRepository.getLatestProjectUpdateConsistent(projectId);
    const projectUpdateNumber = (latestUpdate?.projectUpdateNumber ?? 0) + 1;

    const id = uuid();
    const timestamp = getUtcTimestamp();
    await this.projectsRepository.createProjectUpdate({
      id,
      projectUpdateNumber,
      projectId: projectId,
      creatorId: normalizedUserId,
      creatorName,
      content,
      createdAt: timestamp,
      status: ProjectUpdateStatus.Available,
    });

    const createdProjectUpdate = await this.projectsRepository.getProjectUpdate(
      id
    );
    if (!createdProjectUpdate) {
      throw new CreateProjectUpdateFailedException();
    }

    return createdProjectUpdate;
  }

  async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    const project = await this.getProjectOrThrow(projectId);
    const profile = await this.usersService.getProfile(project.creatorId);
    const updates = await this.projectsRepository.getProjectUpdates(projectId);
    if (profile) {
      updates.forEach((update) => {
        update.avatarUrl = profile.avatarUrl;
      });
    }

    return updates;
  }

  async getProjectStoryOrThrow(projectId: string): Promise<ProjectDetail> {
    const projectDetail = await this.getProjectStory(projectId);
    if (!projectDetail) {
      throw new ProjectStoryNotFoundException();
    }
    return projectDetail;
  }

  private async getProjectStory(
    projectId: string
  ): Promise<ProjectDetail | undefined> {
    await this.getProjectOrThrow(projectId);
    return this.projectsRepository.getProjectDetail(projectId);
  }

  async approveProject(userId: string, projectId: string): Promise<void> {
    const havePermission = await this.privilegesService.isUserHavePermissionFor(
      userId,
      CLPrivilege.ApproveProject
    );
    if (!havePermission) {
      throw new UserDoNotHavePermissionException();
    }

    const project = await this.getProjectOrThrow(projectId);
    if (project.status !== ProjectStatus.Created) {
      throw new ProjectIsNotWaitingForValidationException(project.status);
    }
    if (!project.fundingGoal) {
      throw new BadRequestException('Currently not support null fundingGoal');
    }

    const approveAt = getUtcTimestamp();
    const durationInMillisecond =
      (project.durationInDay ?? 0) * 24 * 3600 * 1000;
    let endAt = -1;
    if (durationInMillisecond !== 0) {
      endAt = approveAt + durationInMillisecond;
    }

    try {
      const txHash = await this.smartContractService.createOnChainProject(
        projectId,
        approveAt,
        endAt,
        project.walletAddress,
        project.fundingGoal
      );
      await this.projectsRepository.approveProject(
        projectId,
        approveAt,
        endAt,
        txHash
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getValidatedProjects(): Promise<Project[]> {
    return this.projectsRepository.getProjectByStatus(ProjectStatus.Validated);
  }

  async markProjectAsFinished(project: Project): Promise<void> {
    if (!project.fundingGoal) {
      return;
    }
    if (project.fundedAmount >= project.fundingGoal) {
      await this.projectsRepository.updateProjectStatus(
        project.id,
        ProjectStatus.SuccessfulFundraising
      );
    } else {
      await this.projectsRepository.updateProjectStatus(
        project.id,
        ProjectStatus.FailedFundraising
      );
    }
  }

  async rejectProject(
    userId: string,
    projectId: string,
    reason: string
  ): Promise<void> {
    const havePermission = await this.privilegesService.isUserHavePermissionFor(
      userId,
      CLPrivilege.ApproveProject
    );
    if (!havePermission) {
      throw new UserDoNotHavePermissionException();
    }

    const project = await this.getProjectOrThrow(projectId);
    if (project.status !== ProjectStatus.Created) {
      throw new ProjectIsNotWaitingForValidationException(project.status);
    }

    await this.projectsRepository.rejectProject(projectId, reason);
  }

  async getCreatedProject(): Promise<Project[]> {
    return this.projectsRepository.getProjectByStatusCreatedAt(
      ProjectStatus.Created
    );
  }
}
