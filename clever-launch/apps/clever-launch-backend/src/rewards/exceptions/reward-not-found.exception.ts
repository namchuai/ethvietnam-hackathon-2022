import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class RewardNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Reward not found',
        errorCode: CleverLaunchExceptionCode.REWARD_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
