import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserEkycNotInReviewException extends HttpException {
  constructor() {
    super(
      {
        message: 'User ekyc is not in-review',
        errorCode: CleverLaunchExceptionCode.EKYC_NOT_IN_REVIEW,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
