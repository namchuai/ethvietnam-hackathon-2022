import { ApiProperty } from '@nestjs/swagger';

export class BackerDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  homePageUrl: string;
  @ApiProperty()
  avatarUrl: string;
  @ApiProperty()
  position: number;
}
