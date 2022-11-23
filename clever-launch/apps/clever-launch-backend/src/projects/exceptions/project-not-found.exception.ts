import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProjectNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Project not found',
        errorCode: CleverLaunchExceptionCode.PROJECT_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
