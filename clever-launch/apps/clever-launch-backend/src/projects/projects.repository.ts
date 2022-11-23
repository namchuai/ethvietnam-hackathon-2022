import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  PendingProject,
  PendingProjectIndex,
  Project,
  ProjectDetail,
  ProjectIndex,
  ProjectStatus,
  ProjectUpdate,
  ProjectUpdateIndex,
} from '@clever-launch/data';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PENDING_PROJECT_TABLE,
  PROJECT_DETAIL_TABLE,
  PROJECT_TABLE,
  PROJECT_UPDATE_TABLE,
} from '../constants';
import { DynamoService } from '../dynamo/dynamo.service';
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import {
  ConditionalCheckFailedException,
  PaginatedArray,
  parseArray,
} from '../utils/dynamodb';
import { ProjectWithSameIdException } from './exceptions/project-with-same-id-created.exception';
import { ProjectNotFoundException } from './exceptions/project-not-found.exception';
import { getUtcTimestamp } from '../utils/date-time';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getProject(projectId: string): Promise<Project | undefined> {
    const ret = await this.databaseService.get({
      TableName: PROJECT_TABLE,
      Key: { id: projectId },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as Project;
  }

  async getProjectOrThrow(projectId: string): Promise<Project> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new ProjectNotFoundException();
    }
    return project;
  }

  async getProjects(
    limit: number,
    newestFirst: boolean,
    lastEvaluatedKey: Record<string, unknown> | undefined
  ): Promise<PaginatedArray<Project>> {
    const queryInput: QueryCommandInput = {
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.ApprovedAtIndex,
      KeyConditionExpression: 'scannable = :scannable',
      FilterExpression: '#status = :validated',
      ExpressionAttributeNames: { '#status': 'status' },
      ScanIndexForward: !newestFirst,
      ExpressionAttributeValues: marshall({
        ':scannable': 'scannable',
        ':validated': ProjectStatus.Validated,
      }),
      Limit: limit,
    };
    if (lastEvaluatedKey) {
      queryInput.ExclusiveStartKey = marshall(lastEvaluatedKey);
    }
    const result = await this.databaseService.query(queryInput);
    const projects = parseArray<Project>(result.Items);
    return {
      data: projects,
      lastEvaluatedKey: result.LastEvaluatedKey
        ? unmarshall(result.LastEvaluatedKey)
        : undefined,
    };
  }

  async getFeaturedProjects(
    limit: number,
    lastEvaluatedKey: Record<string, unknown> | undefined
  ): Promise<PaginatedArray<Project>> {
    const queryInput: QueryCommandInput = {
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.FeaturedPointIndex,
      FilterExpression: '#status = :validated',
      ExpressionAttributeNames: { '#status': 'status' },
      KeyConditionExpression: 'scannable = :scannable',
      ExpressionAttributeValues: marshall({
        ':scannable': 'scannable',
        ':validated': ProjectStatus.Validated,
      }),
      Limit: limit,
    };
    if (lastEvaluatedKey) {
      queryInput.ExclusiveStartKey = marshall(lastEvaluatedKey);
    }
    const result = await this.databaseService.query(queryInput);
    const projects = parseArray<Project>(result.Items);
    return {
      data: projects,
      lastEvaluatedKey: result.LastEvaluatedKey
        ? unmarshall(result.LastEvaluatedKey)
        : undefined,
    };
  }

  async getUserProjects(
    userId: string,
    limit: number,
    lastEvaluatedKey: Record<string, unknown> | undefined
  ): Promise<PaginatedArray<Project>> {
    const queryInput: QueryCommandInput = {
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.MyProjectIndex,
      KeyConditionExpression: 'creatorId = :userId',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
      }),
      ScanIndexForward: false,
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      queryInput.ExclusiveStartKey = marshall(lastEvaluatedKey);
    }
    const result = await this.databaseService.query(queryInput);
    const projects = parseArray<Project>(result.Items);
    return {
      data: projects,
      lastEvaluatedKey: result.LastEvaluatedKey
        ? unmarshall(result.LastEvaluatedKey)
        : undefined,
    };
  }

  async createProject(item: Project): Promise<void> {
    try {
      await this.databaseService.put({
        TableName: PROJECT_TABLE,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)',
      });
    } catch (err) {
      if (err.name === ConditionalCheckFailedException) {
        throw new ProjectWithSameIdException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createPendingProject(item: PendingProject): Promise<void> {
    try {
      await this.databaseService.put({
        TableName: PENDING_PROJECT_TABLE,
        Item: item,
        ConditionExpression: 'attribute_not_exists(creatorId)',
      });
    } catch (err) {
      if (err.name === ConditionalCheckFailedException) {
        throw new ProjectWithSameIdException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getPendingProjectByProjectId(
    projectId: string
  ): Promise<PendingProject | undefined> {
    const ret = await this.databaseService.query({
      TableName: PENDING_PROJECT_TABLE,
      IndexName: PendingProjectIndex.ProjectIdIndex,
      KeyConditionExpression: 'projectId = :projectId',
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
      }),
    });
    const pendingProjects = parseArray<PendingProject>(ret.Items);
    if (!pendingProjects.length) {
      return undefined;
    }
    return pendingProjects[0];
  }

  async getPendingProject(userId: string): Promise<PendingProject | undefined> {
    const ret = await this.databaseService.get({
      TableName: PENDING_PROJECT_TABLE,
      Key: { creatorId: userId },
    });
    if (!ret) {
      return undefined;
    }

    return ret.Item as PendingProject;
  }

  async updatePendingProject(item: PendingProject): Promise<void> {
    await this.databaseService.put({
      TableName: PENDING_PROJECT_TABLE,
      Item: item,
    });
  }

  async createProjectDetail(item: ProjectDetail): Promise<void> {
    await this.databaseService.put({
      TableName: PROJECT_DETAIL_TABLE,
      Item: item,
    });
  }

  async deletePendingProject(userId: string): Promise<void> {
    await this.databaseService.delete({
      TableName: PENDING_PROJECT_TABLE,
      Key: { creatorId: userId },
    });
  }

  async getUserProjectsByStatus(
    userId: string,
    projectStatus: ProjectStatus
  ): Promise<Project[]> {
    const ret = await this.databaseService.query({
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.UserProjectStatusIndex,
      KeyConditionExpression: 'creatorId = :userId AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: marshall({
        ':userId': userId,
        ':status': projectStatus,
      }),
    });
    return parseArray<Project>(ret.Items);
  }

  async createProjectUpdate(item: ProjectUpdate): Promise<void> {
    await this.databaseService.put({
      TableName: PROJECT_UPDATE_TABLE,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    });
  }

  async getProjectUpdate(
    projectUpdateId: string
  ): Promise<ProjectUpdate | undefined> {
    const ret = await this.databaseService.get({
      TableName: PROJECT_UPDATE_TABLE,
      Key: { id: projectUpdateId },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as ProjectUpdate;
  }

  async getLatestProjectUpdateConsistent(
    projectId: string
  ): Promise<ProjectUpdate | undefined> {
    const ret = await this.databaseService.query({
      TableName: PROJECT_UPDATE_TABLE,
      IndexName: ProjectUpdateIndex.ProjectIndex,
      KeyConditionExpression: 'projectId = :projectId',
      ScanIndexForward: false,
      Limit: 1,
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
      }),
    });
    const updates = parseArray<ProjectUpdate>(ret.Items);
    if (!updates.length) {
      return undefined;
    }

    return updates.shift();
  }

  async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    const ret = await this.databaseService.query({
      TableName: PROJECT_UPDATE_TABLE,
      IndexName: ProjectUpdateIndex.ProjectIndex,
      KeyConditionExpression: 'projectId = :projectId',
      Limit: 20,
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
      }),
    });

    return parseArray<ProjectUpdate>(ret.Items);
  }

  async getProjectDetail(
    projectId: string
  ): Promise<ProjectDetail | undefined> {
    const ret = await this.databaseService.get({
      TableName: PROJECT_DETAIL_TABLE,
      Key: { projectId: projectId },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as ProjectDetail;
  }

  async approveProject(
    projectId: string,
    approvedAt: number,
    endAt: number,
    txHash: string
  ): Promise<void> {
    await this.databaseService.update({
      TableName: PROJECT_TABLE,
      Key: { id: projectId },
      ConditionExpression: '#status = :created',
      UpdateExpression:
        'SET #status = :validated' +
        ', approvedAt = :approvedAt' +
        ', endAt = :endAt' +
        ', createProjectTxHash = :txHash',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':created': ProjectStatus.Created,
        ':validated': ProjectStatus.Validated,
        ':approvedAt': approvedAt,
        ':endAt': endAt,
        ':txHash': txHash,
      },
    });
  }

  async getProjectByStatus(status: ProjectStatus): Promise<Project[]> {
    const ret = await this.databaseService.query({
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.StatusApprovedAtIndex,
      ScanIndexForward: true,
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: marshall({
        ':status': status,
      }),
    });

    return parseArray<Project>(ret.Items);
  }

  async getProjectByStatusCreatedAt(status: ProjectStatus): Promise<Project[]> {
    const ret = await this.databaseService.query({
      TableName: PROJECT_TABLE,
      IndexName: ProjectIndex.StatusCreatedAtIndex,
      ScanIndexForward: true,
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: marshall({
        ':status': status,
      }),
    });

    return parseArray<Project>(ret.Items);
  }

  async rejectProject(projectId: string, reason: string): Promise<void> {
    await this.databaseService.update({
      TableName: PROJECT_TABLE,
      Key: { id: projectId },
      ConditionExpression: '#status = :created',
      UpdateExpression:
        'SET #status = :validationFailed' +
        ', validationFailedReason = :reason' +
        ', updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':created': ProjectStatus.Created,
        ':validationFailed': ProjectStatus.ValidationFailed,
        ':reason': reason,
        ':updatedAt': getUtcTimestamp(),
      },
    });
  }

  async updateProjectStatus(
    projectId: string,
    status: ProjectStatus
  ): Promise<void> {
    await this.databaseService.update({
      TableName: PROJECT_TABLE,
      Key: { id: projectId },
      ConditionExpression: '#status = :validated',
      UpdateExpression: 'SET #status = :status' + ', updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':validated': ProjectStatus.Validated,
        ':status': status,
        ':updatedAt': getUtcTimestamp(),
      },
    });
  }
}
