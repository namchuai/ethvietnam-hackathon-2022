import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class RewardNotAvailableForThisProject extends HttpException {
  constructor() {
    super(
      {
        message: 'This reward is not available for this project',
        errorCode: CleverLaunchExceptionCode.REWARD_NOT_AVAILABLE_FOR_PROJECT,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
