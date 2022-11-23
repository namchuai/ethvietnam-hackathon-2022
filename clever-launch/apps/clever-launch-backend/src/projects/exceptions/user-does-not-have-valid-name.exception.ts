import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserDoesNotHaveValidName extends HttpException {
  constructor() {
    super(
      {
        message: 'User does not have a valid name',
        errorCode: CleverLaunchExceptionCode.USER_DOES_NOT_HAVE_A_VALID_NAME,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
