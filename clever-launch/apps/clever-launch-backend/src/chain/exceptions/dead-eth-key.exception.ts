import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class DeadEthKeyException extends HttpException {
  constructor() {
    super(
      {
        message: 'Eth key must NOT be dead address',
        errorCode: CleverLaunchExceptionCode.DEAD_ETH_KEY,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
