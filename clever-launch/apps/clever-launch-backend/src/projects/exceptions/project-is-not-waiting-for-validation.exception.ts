import { HttpException, HttpStatus } from '@nestjs/common';
import { ProjectStatus } from '@clever-launch/data';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProjectIsNotWaitingForValidationException extends HttpException {
  constructor(status: ProjectStatus) {
    super(
      {
        message: `Project status is not waiting for validation. Current status is ${status}`,
        errorCode: CleverLaunchExceptionCode.PROJECT_IS_NOT_WAITING_FOR_VALIDATION,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
