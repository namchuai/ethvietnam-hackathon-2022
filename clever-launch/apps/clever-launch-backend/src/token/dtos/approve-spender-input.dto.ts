import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ApproveSpenderInputDto {
  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
