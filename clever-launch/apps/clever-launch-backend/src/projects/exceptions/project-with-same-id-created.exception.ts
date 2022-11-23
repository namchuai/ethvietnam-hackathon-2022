import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProjectWithSameIdException extends HttpException {
  constructor() {
    super(
      {
        message: 'Project id conflicted',
        errorCode: CleverLaunchExceptionCode.PROJECT_ID_CONFLICTED,
      },
      HttpStatus.CONFLICT
    );
  }
}
