import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class RejectEkycInputDto {
  @ApiProperty()
  @IsEthereumAddress()
  ekycRequestUserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
