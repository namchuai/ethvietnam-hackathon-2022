import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserAuthNonceEmptyException extends HttpException {
  constructor() {
    super(
      {
        message:
          'Auth nonce not found. Be sure to invoke getAuthWalletNonce first',
        errorCode: CleverLaunchExceptionCode.AUTH_NONCE_EMPTY,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
