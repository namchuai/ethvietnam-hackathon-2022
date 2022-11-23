import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RemoveProjectRewardInput } from './dtos/remove-project-reward-input.dto';
import { RewardDto } from './dtos/reward.dto';
import { RewardsService } from './rewards.service';
import { CreateRewardInputDto } from './dtos/create-reward-input.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateRewardInputDto } from './dtos/update-reward-input.dto';

@Controller('rewards')
@ApiTags('Rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('project/:projectId')
  @ApiResponse({ type: RewardDto, isArray: true })
  async getProjectRewards(
    @Param('projectId') projectId: string
  ): Promise<RewardDto[]> {
    return this.rewardsService.getProjectRewards(projectId);
  }

  @Get(':rewardId')
  @ApiResponse({ type: RewardDto })
  async getReward(@Param('rewardId') rewardId: string): Promise<RewardDto> {
    return this.rewardsService.getRewardOrThrow(rewardId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: RewardDto })
  async createReward(
    @Req() request,
    @Body() body: CreateRewardInputDto
  ): Promise<RewardDto> {
    const userId = request.user.id;
    return this.rewardsService.createRewards(userId, body);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: RewardDto })
  async updateReward(
    @Req() request,
    @Body() body: UpdateRewardInputDto
  ): Promise<RewardDto> {
    const userId = request.user.id;
    return this.rewardsService.updateReward(userId, body);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeReward(
    @Req() request,
    @Body() body: RemoveProjectRewardInput
  ): Promise<void> {
    const { rewardId } = body;
    const userId = request.user.id;
    return this.rewardsService.removeReward(userId, rewardId);
  }
}
