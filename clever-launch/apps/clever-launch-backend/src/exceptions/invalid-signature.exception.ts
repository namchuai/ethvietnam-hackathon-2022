import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../clever-launch-exception.code';

export class InvalidSignatureException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid signature',
        errorCode: CleverLaunchExceptionCode.INVALID_SIGNATURE,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
