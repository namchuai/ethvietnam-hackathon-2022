import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class TransactionNotBelongToUserException extends HttpException {
  constructor() {
    super(
      {
        message: 'Transaction not belong to user',
        errorCode: CleverLaunchExceptionCode.TRANSACTION_NOT_BELONG_TO_USER,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
