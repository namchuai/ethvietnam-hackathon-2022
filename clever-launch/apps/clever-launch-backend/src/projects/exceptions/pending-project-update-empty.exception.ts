import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class PendingProjectUpdateEmptyException extends HttpException {
  constructor() {
    super(
      {
        message: 'Pending project update body is empty',
        errorCode: CleverLaunchExceptionCode.PENDING_PROJECT_UPDATE_EMPTY,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
