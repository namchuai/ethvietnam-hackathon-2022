import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EkycStatus } from '@clever-launch/data';

export class GetUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eKycStatus: EkycStatus;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  dateOfBirth?: string;
}
