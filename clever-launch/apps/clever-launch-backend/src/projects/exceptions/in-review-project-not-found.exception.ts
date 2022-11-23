import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class InReviewProjectNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'User does not have any in review project',
        errorCode: CleverLaunchExceptionCode.IN_REVIEW_PROJECT_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
