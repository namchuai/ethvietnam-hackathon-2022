import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectResponseDto } from './project-response.dto';

export class PaginatedProjectResponseDto {
  @ApiProperty()
  data: ProjectResponseDto[];

  @ApiPropertyOptional()
  lastEvaluatedKey?: Record<string, unknown>;
}
