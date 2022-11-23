import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SubmitEkycInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryOfResidence: string;

  @ApiProperty()
  @IsUrl()
  frontUrl: string;

  @ApiProperty()
  @IsUrl()
  backUrl: string;

  @ApiProperty()
  @IsUrl()
  selfie: string;
}
