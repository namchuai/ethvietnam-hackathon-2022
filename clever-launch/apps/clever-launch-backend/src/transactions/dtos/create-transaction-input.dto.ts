import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { IsTransactionHashValid } from '../../custom-validators/is-transaction-hash-valid.validator';

export class CreateTransactionInputDto {
  @ApiProperty()
  @IsTransactionHashValid()
  transactionHash: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  rewardId?: string;
}
