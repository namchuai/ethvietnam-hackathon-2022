import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectUpdateStatus } from '@clever-launch/data';

export class ProjectUpdateResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  projectUpdateNumber: number;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  creatorId: string;
  @ApiProperty()
  creatorName: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  status: ProjectUpdateStatus;
  @ApiPropertyOptional()
  updatedAt?: number;
  @ApiPropertyOptional()
  avatarUrl?: string;
}
