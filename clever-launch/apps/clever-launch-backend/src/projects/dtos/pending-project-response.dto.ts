import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectTag } from '@clever-launch/data';

export class PendingProjectResponseDto {
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  creatorId: string;
  @ApiPropertyOptional()
  title?: string;
  @ApiPropertyOptional()
  creatorName?: string;
  @ApiPropertyOptional()
  subTitle?: string;
  @ApiPropertyOptional()
  tags?: ProjectTag[];
  @ApiPropertyOptional()
  fundingGoal?: number;
  @ApiPropertyOptional()
  durationInDay?: number;
  @ApiPropertyOptional()
  story?: string;
  @ApiPropertyOptional()
  walletAddress?: string;
  @ApiPropertyOptional()
  contactEmail?: string;
  @ApiPropertyOptional()
  updatedAt?: number;
}
