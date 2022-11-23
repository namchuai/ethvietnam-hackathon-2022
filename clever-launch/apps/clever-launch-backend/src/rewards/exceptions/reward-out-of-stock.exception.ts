import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class RewardIsOutOfStockException extends HttpException {
  constructor() {
    super(
      {
        message: 'This reward is out of stock',
        errorCode: CleverLaunchExceptionCode.REWARD_IS_OUT_OF_STOCK,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
