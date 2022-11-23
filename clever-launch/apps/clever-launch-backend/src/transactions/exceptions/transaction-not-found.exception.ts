import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class TransactionNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Transaction not found',
        errorCode: CleverLaunchExceptionCode.TRANSACTION_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
