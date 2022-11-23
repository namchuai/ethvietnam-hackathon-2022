import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Configuration,
  FundRaisingMethod,
  IntroType,
} from '@clever-launch/data';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ProjectTagDto } from '../../project-tags/dtos/project-tag.dto';

export class CreateProjectInputDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(Configuration.PROJECT_TITLE_MAX_LENGTH)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(Configuration.PROJECT_SUB_TITLE_MAX_LENGTH)
  subTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IntroType)
  introType: IntroType;

  @ApiProperty()
  @IsUrl()
  introUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  pitchDeckUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(Configuration.PROJECT_MIN_DURATION_IN_DAY)
  @Max(Configuration.PROJECT_MAX_DURATION_IN_DAY)
  durationInDay?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FundRaisingMethod)
  fundRaisingMethod: FundRaisingMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  fundingGoal?: number;

  @ApiProperty()
  @IsArray()
  tags: ProjectTagDto[];

  @ApiProperty()
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  story: string;
}
