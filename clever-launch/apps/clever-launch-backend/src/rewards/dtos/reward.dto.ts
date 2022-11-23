import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RewardType, RewardStatus } from '@clever-launch/data';

export class RewardDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  totalAmount: number;
  @ApiProperty()
  amountLeft: number;
  @ApiProperty()
  price: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  estDeliveryMonth: number;
  @ApiProperty()
  estDeliveryYear: number;
  @ApiPropertyOptional()
  deliveryNote?: string;
  @ApiProperty()
  rewardType: RewardType;
  @ApiProperty()
  rewardStatus: RewardStatus;
}
