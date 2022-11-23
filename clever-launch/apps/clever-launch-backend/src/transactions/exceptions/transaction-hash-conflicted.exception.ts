import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class TransactionHashConflictedException extends HttpException {
  constructor() {
    super(
      {
        message: 'Transaction hash is already registered',
        errorCode:
          CleverLaunchExceptionCode.TRANSACTION_HASH_ALREADY_REGISTERED,
      },
      HttpStatus.CONFLICT
    );
  }
}
