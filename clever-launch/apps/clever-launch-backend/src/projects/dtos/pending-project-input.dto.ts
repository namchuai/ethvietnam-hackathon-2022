import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  Configuration,
  FundRaisingMethod,
  IntroType,
} from '@clever-launch/data';
import { ProjectTagDto } from '../../project-tags/dtos/project-tag.dto';

export class PendingProjectInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(Configuration.PROJECT_TITLE_MAX_LENGTH)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(Configuration.PROJECT_SUB_TITLE_MAX_LENGTH)
  subTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  tags?: ProjectTagDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  fundingGoal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(Configuration.PROJECT_MIN_DURATION_IN_DAY)
  @Max(Configuration.PROJECT_MAX_DURATION_IN_DAY)
  durationInDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  story?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEthereumAddress()
  walletAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(IntroType)
  introType?: IntroType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  introUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  pitchDeckUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(FundRaisingMethod)
  fundRaisingMethod: FundRaisingMethod;
}
