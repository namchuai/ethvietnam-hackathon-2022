import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class ApproveEkycInputDto {
  @ApiProperty()
  @IsEthereumAddress()
  ekycRequestUserId: string;
}
