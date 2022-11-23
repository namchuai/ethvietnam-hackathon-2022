import { ApiProperty } from '@nestjs/swagger';

export class ProjectTagDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  value: string;
  @ApiProperty()
  position: number;
}
