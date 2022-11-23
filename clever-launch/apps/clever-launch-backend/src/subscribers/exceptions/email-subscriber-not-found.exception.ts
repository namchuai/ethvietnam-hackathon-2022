import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class EmailSubscriberNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'This email is not recorded',
        errorCode: CleverLaunchExceptionCode.EMAIL_SUBSCRIBER_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
