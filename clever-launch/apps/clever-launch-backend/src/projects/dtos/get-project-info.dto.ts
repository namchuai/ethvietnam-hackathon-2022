import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetProjectInfoDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;
}
