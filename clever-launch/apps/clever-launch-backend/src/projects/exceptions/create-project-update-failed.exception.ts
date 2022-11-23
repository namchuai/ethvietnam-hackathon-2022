import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class CreateProjectUpdateFailedException extends HttpException {
  constructor() {
    super(
      {
        message: 'Failed to create project update',
        errorCode: CleverLaunchExceptionCode.PROJECT_UPDATE_CREATE_FAILED,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
