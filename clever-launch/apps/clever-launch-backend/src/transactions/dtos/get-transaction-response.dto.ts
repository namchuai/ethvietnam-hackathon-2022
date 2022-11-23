import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '@clever-launch/data';

export class GetTransactionResponseDto {
  userId: string;
  @ApiProperty()
  transactionHash: string;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  projectTitle: string;
  @ApiProperty()
  transactionStatus: TransactionStatus;
  @ApiPropertyOptional()
  updatedAt?: number;
}
