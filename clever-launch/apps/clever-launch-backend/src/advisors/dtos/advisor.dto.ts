import { ApiProperty } from '@nestjs/swagger';

export class AdvisorDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatarUrl: string;
  @ApiProperty()
  description: string;
}
