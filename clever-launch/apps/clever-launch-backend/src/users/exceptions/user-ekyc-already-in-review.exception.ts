import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserEkycAlreadyInReviewException extends HttpException {
  constructor() {
    super(
      {
        message: 'User ekyc is in-review',
        errorCode: CleverLaunchExceptionCode.EKYC_IN_REVIEW,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
