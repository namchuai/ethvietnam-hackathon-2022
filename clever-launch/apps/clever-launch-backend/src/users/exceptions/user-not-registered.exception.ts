import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserNotRegisteredException extends HttpException {
  constructor() {
    super(
      {
        message: 'User not found',
        errorCode: CleverLaunchExceptionCode.USER_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
