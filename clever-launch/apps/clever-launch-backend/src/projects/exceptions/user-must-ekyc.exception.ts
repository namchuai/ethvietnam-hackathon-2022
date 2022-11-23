import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserMustEkycException extends HttpException {
  constructor() {
    super(
      {
        message: 'User must eKYC before continue',
        errorCode: CleverLaunchExceptionCode.USER_MUST_EKYC_FIRST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
