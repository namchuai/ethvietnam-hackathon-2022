import { ApiProperty } from '@nestjs/swagger';

export class GetProjectStoryResponseDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  story: string;
}
