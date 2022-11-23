import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserNotOwnProjectException extends HttpException {
  constructor() {
    super(
      {
        message: 'User not own project',
        errorCode: CleverLaunchExceptionCode.USER_NOT_OWN_PROJECT,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
