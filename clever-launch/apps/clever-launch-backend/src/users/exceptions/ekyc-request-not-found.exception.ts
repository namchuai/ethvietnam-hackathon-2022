import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class EkycRequestNotFound extends HttpException {
  constructor() {
    super(
      {
        message: 'eKYC request not found',
        errorCode: CleverLaunchExceptionCode.EKYC_REQUEST_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
