import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserDoNotHavePermissionException extends HttpException {
  constructor() {
    super(
      {
        message: 'User does not have permission to perform this action',
        errorCode: CleverLaunchExceptionCode.USER_DO_NOT_HAVE_PERMISSION,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
