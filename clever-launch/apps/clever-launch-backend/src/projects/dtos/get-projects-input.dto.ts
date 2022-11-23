import { ApiPropertyOptional } from '@nestjs/swagger';
import { ALL_PROJECT_LIMIT } from '../../constants';

export class GetProjectsInputDto {
  @ApiPropertyOptional({
    description: `Limit the result count, default is ${ALL_PROJECT_LIMIT}`,
  })
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Only accept two values for now: newest_first / oldest_first. Default is newest_first',
  })
  sortType?: string;

  @ApiPropertyOptional()
  lastProjectId?: string;

  @ApiPropertyOptional()
  lastProjectCreatedAt?: number;
}
