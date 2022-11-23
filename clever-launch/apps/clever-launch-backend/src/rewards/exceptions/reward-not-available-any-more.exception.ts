import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class RewardNotAvailableAnymoreException extends HttpException {
  constructor() {
    super(
      {
        message: 'This reward not available anymore',
        errorCode: CleverLaunchExceptionCode.REWARD_NOT_AVAILABLE_ANYMORE,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
