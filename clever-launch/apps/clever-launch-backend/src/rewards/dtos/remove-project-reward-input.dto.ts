import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveProjectRewardInput {
  @ApiProperty()
  @IsUUID()
  rewardId: string;
}
