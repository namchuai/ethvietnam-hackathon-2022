import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class PendingProjectAlreadyExistException extends HttpException {
  constructor() {
    super(
      {
        message: 'Pending project already exist',
        errorCode: CleverLaunchExceptionCode.PENDING_PROJECT_ALREADY_EXIST,
      },
      HttpStatus.CONFLICT
    );
  }
}
