import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class AmountIsLessThanRewardPrice extends HttpException {
  constructor(amount: number, rewardPrice: number) {
    super(
      {
        message: `The amount ${amount} can't be less than reward's price ${rewardPrice}`,
        errorCode: CleverLaunchExceptionCode.AMOUNT_IS_LESS_THAN_REWARD_PRICE,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
