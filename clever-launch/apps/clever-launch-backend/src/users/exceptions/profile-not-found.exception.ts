import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProfileNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Profile not found',
        errorCode: CleverLaunchExceptionCode.PROFILE_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
