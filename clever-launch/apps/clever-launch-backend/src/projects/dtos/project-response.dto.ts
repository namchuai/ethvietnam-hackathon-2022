import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FundRaisingMethod,
  IntroType,
  ProjectStatus,
} from '@clever-launch/data';
import { ProjectTagDto } from '../../project-tags/dtos/project-tag.dto';

export class ProjectResponseDto {
  @ApiProperty()
  creatorId: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  subTitle: string;
  @ApiProperty()
  introType: IntroType;
  @ApiProperty()
  introUrl: string;
  @ApiProperty()
  fundRaisingMethod: FundRaisingMethod;
  @ApiPropertyOptional()
  fundingGoal?: number;
  @ApiPropertyOptional()
  durationInDay?: number;
  @ApiProperty()
  pitchDeckUrl?: string;
  @ApiProperty()
  tags: ProjectTagDto[];
  @ApiProperty()
  walletAddress: string;
  @ApiProperty()
  contactEmail: string;
  @ApiProperty()
  updatedAt?: number;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  status: ProjectStatus;
  @ApiProperty()
  featuredPoint: number;
  @ApiProperty()
  fundedAmount: number;
  @ApiProperty()
  backerCount: number;
  @ApiPropertyOptional()
  creatorFirstName?: string;
  @ApiPropertyOptional()
  creatorLastName?: string;
  @ApiPropertyOptional()
  creatorProfileName?: string;
}
