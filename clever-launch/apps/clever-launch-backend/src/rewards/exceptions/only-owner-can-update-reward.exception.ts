import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class OnlyOwnerCanUpdateRewardException extends HttpException {
  constructor() {
    super(
      {
        message: 'Reward can only be updated by its owner',
        errorCode: CleverLaunchExceptionCode.REWARD_ONLY_UPDATE_BY_OWNER,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
