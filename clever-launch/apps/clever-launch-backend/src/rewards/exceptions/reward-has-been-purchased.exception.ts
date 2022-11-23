import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class RewardHasBeenPurchasedException extends HttpException {
  constructor() {
    super(
      {
        message:
          "Reward has been purchased and can't be delete. Please contact CleverLaunch team",
        errorCode: CleverLaunchExceptionCode.REWARD_HAS_BEEN_PURCHASED,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
