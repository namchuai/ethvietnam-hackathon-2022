import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class PendingProjectNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Pending project not found',
        errorCode: CleverLaunchExceptionCode.PENDING_PROJECT_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
