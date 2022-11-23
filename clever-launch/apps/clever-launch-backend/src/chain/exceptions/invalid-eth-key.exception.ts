import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class InvalidEthKeyException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid ETH key',
        errorCode: CleverLaunchExceptionCode.INVALID_ETH_KEY,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
