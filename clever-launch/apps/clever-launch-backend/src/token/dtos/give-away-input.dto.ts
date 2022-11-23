import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNumberString } from 'class-validator';

export class GiveAwayInputDto {
  @ApiProperty()
  @IsEthereumAddress()
  recipientAddress: string;

  @ApiProperty()
  @IsNumberString()
  amount: string;
}
