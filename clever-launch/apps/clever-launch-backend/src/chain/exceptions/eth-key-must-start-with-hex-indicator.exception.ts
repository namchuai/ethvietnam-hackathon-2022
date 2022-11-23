import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class EthKeyMustStartWithHexIndicatorException extends HttpException {
  constructor() {
    super(
      {
        message: 'Eth key must start with hex indicator 0x',
        errorCode: CleverLaunchExceptionCode.MUST_START_WITH_0x,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
