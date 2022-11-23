import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UniqueTransactionConflictException extends HttpException {
  constructor() {
    super(
      {
        message: 'This transaction hash is already recorded',
        errorCode: CleverLaunchExceptionCode.UNIQUE_TRANSACTION_CONFLICT,
      },
      HttpStatus.CONFLICT
    );
  }
}
