import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailUnsubscribeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
