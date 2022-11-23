import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class EmailAlreadySubscribedException extends HttpException {
  constructor() {
    super(
      {
        message: 'Email is already subscribed',
        errorCode: CleverLaunchExceptionCode.EMAIL_ALREADY_SUBSCRIBED,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
