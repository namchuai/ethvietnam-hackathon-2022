import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';
import { ALL_PROJECT_LIMIT } from '../../constants';

export class GetUserProjectsInputDto {
  @ApiProperty({ description: 'User id' })
  @IsEthereumAddress()
  id: string;

  @ApiPropertyOptional({ description: `Default is ${ALL_PROJECT_LIMIT}` })
  limit?: number;

  @ApiPropertyOptional()
  lastProjectId?: string;

  @ApiPropertyOptional()
  lastProjectCreatedAt?: number;
}
