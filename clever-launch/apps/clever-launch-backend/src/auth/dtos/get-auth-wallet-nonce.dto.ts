import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class GetAuthWalletNonceDto {
  @ApiProperty()
  @IsEthereumAddress()
  ethKey: string;
}
