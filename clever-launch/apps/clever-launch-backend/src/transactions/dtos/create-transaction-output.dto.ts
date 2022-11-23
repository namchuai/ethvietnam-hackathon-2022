import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionOutputDto {
  @ApiProperty()
  transactionHash: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  projectTitle: string;

  @ApiProperty()
  createdAt: number;

  @ApiPropertyOptional()
  rewardId?: string;
}
