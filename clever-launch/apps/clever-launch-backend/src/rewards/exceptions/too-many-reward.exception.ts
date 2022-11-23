import { HttpException, HttpStatus } from '@nestjs/common';
import { Configuration } from '@clever-launch/data';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class TooManyRewardException extends HttpException {
  constructor() {
    super(
      {
        message: `Maximum allowed rewards is ${Configuration.MAX_REWARD_AVAILABLE}`,
        errorCode: CleverLaunchExceptionCode.TOO_MANY_REWARD,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
