import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class NullEthKeyException extends HttpException {
  constructor() {
    super(
      {
        message: 'Eth key must NOT be null',
        errorCode: CleverLaunchExceptionCode.NULL_ETH_KEY,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
