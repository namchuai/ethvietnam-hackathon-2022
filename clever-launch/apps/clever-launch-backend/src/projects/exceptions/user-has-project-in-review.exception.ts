import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserHasProjectInReviewException extends HttpException {
  constructor() {
    super(
      {
        message: 'User has project in review',
        errorCode: CleverLaunchExceptionCode.USER_HAS_PROJECT_IN_REVIEW,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
