import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Express } from 'express';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExtender } from '../utils/file-extender.interceptor';
import { GetProjectsInputDto } from './dtos/get-projects-input.dto';
import { GetFeaturedProjectsInputDto } from './dtos/get-featured-projects-input.dto';
import { CreateProjectInputDto } from './dtos/create-project-input.dto';
import { GetUserProjectsInputDto } from './dtos/get-user-projects-input.dto';
import { PaginatedProjectResponseDto } from './dtos/paginated-project-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PendingProjectResponseDto } from './dtos/pending-project-response.dto';
import { PendingProjectInputDto } from './dtos/pending-project-input.dto';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectUpdateResponseDto } from './dtos/project-update-response.dto';
import { CreateProjectUpdateInputDto } from './dtos/create-project-update-input.dto';
import { GetProjectInfoDto } from './dtos/get-project-info.dto';
import { GetProjectStoryResponseDto } from './dtos/get-project-story-response.dto';
import { RejectProjectInputDto } from './dtos/reject-project-input.dto';

@Controller('projects')
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: PaginatedProjectResponseDto,
  })
  async getProjects(
    @Query() params: GetProjectsInputDto
  ): Promise<PaginatedProjectResponseDto> {
    const { limit, sortType, lastProjectId, lastProjectCreatedAt } = params;
    return this.projectsService.getAllProjects(
      limit,
      sortType,
      lastProjectId,
      lastProjectCreatedAt
    );
  }

  @Get('featured')
  @ApiResponse({
    type: PaginatedProjectResponseDto,
  })
  async getFeaturedProjects(
    @Query() params: GetFeaturedProjectsInputDto
  ): Promise<PaginatedProjectResponseDto> {
    const { limit, id, featuredPoint } = params;
    return this.projectsService.getFeaturedProjects(limit, id, featuredPoint);
  }

  @Get('detail/:projectId')
  async getProject(
    @Param() params: GetProjectInfoDto
  ): Promise<ProjectResponseDto> {
    return this.projectsService.getProjectOrThrow(params.projectId);
  }

  @Get('user')
  @ApiResponse({
    type: PaginatedProjectResponseDto,
  })
  async getUserProjects(
    @Query() params: GetUserProjectsInputDto
  ): Promise<PaginatedProjectResponseDto> {
    const { id, limit, lastProjectId, lastProjectCreatedAt } = params;
    return this.projectsService.getUserProjects(
      id,
      limit,
      lastProjectId,
      lastProjectCreatedAt
    );
  }

  @Post('upload/medium')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProjectMedium(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = request.user.id;
    const projectId = file['projectId'];
    return this.projectsService.uploadMedium(userId, projectId, file.buffer);
  }

  @Post('upload/pitch-deck')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProjectPitchDeck(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    const projectId = file['projectId'];
    return this.projectsService.uploadProjectPitchDeck(
      request.user.id,
      projectId,
      file.buffer,
      file.mimetype
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: ProjectResponseDto,
  })
  async createProject(
    @Req() request,
    @Body() body: CreateProjectInputDto
  ): Promise<ProjectResponseDto> {
    return this.projectsService.createProject(request.user.id, body);
  }

  @Post('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPendingProject(
    @Req() request
  ): Promise<PendingProjectResponseDto> {
    return this.projectsService.createPendingProject(request.user.id);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPendingProject(@Req() request): Promise<PendingProjectResponseDto> {
    return this.projectsService.getPendingProjectOrThrow(request.user.id);
  }

  @Patch('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submitPendingProject(
    @Req() request,
    @Body() body: PendingProjectInputDto
  ): Promise<PendingProjectResponseDto> {
    return this.projectsService.updatePendingProject(request.user.id, body);
  }

  @Get('in-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getInReviewProject(@Req() request): Promise<ProjectResponseDto> {
    const userId: string = request.user.id;
    return this.projectsService.getInReviewProjectOrThrow(userId);
  }

  @Post('updates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: ProjectUpdateResponseDto,
  })
  async createProjectUpdate(
    @Req() request,
    @Body() payload: CreateProjectUpdateInputDto
  ): Promise<ProjectUpdateResponseDto> {
    const userId: string = request.user.id;
    return this.projectsService.createProjectUpdate(userId, payload);
  }

  @Get('updates/:projectId')
  @ApiResponse({
    type: ProjectUpdateResponseDto,
    isArray: true,
  })
  async getProjectUpdates(
    @Param() params: GetProjectInfoDto
  ): Promise<ProjectUpdateResponseDto[]> {
    const { projectId } = params;
    return this.projectsService.getProjectUpdates(projectId);
  }

  @Get('story/:projectId')
  async getProjectStory(
    @Param() params: GetProjectInfoDto
  ): Promise<GetProjectStoryResponseDto> {
    const { projectId } = params;
    return this.projectsService.getProjectStoryOrThrow(projectId);
  }

  @Post('validation/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async approveProject(
    @Req() request,
    @Body() payload: GetProjectInfoDto
  ): Promise<void> {
    const userId: string = request.user.id;
    return this.projectsService.approveProject(userId, payload.projectId);
  }

  @Post('validation/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async rejectProject(@Req() request, @Body() payload: RejectProjectInputDto) {
    const userId: string = request.user.id;
    const { projectId, reason } = payload;
    return this.projectsService.rejectProject(userId, projectId, reason);
  }

  @Get('created')
  async getCreatedProjects(): Promise<ProjectResponseDto[]> {
    return this.projectsService.getCreatedProject();
  }
}
