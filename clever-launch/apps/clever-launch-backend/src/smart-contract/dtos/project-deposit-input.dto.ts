import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProjectDepositInputDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsEthereumAddress()
  publicKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @ApiProperty()
  @IsNumberString()
  amount: string;
}
