import { ApiPropertyOptional } from '@nestjs/swagger';
import { FEATURED_PROJECT_LIMIT } from '../../constants';

export class GetFeaturedProjectsInputDto {
  @ApiPropertyOptional({
    description: `Limit the result count, default is ${FEATURED_PROJECT_LIMIT}`,
  })
  limit?: number;

  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  featuredPoint?: number;
}
