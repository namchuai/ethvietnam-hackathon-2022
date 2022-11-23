import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenticateWalletResponseDto {
  @ApiProperty()
  @IsString()
  accessToken: string;
}
