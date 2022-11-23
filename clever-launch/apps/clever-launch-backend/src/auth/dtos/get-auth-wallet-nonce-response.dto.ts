import { ApiProperty } from '@nestjs/swagger';

export class GetAuthWalletNonceResponseDto {
  @ApiProperty()
  nonce: number;
}
