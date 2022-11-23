import { HttpException, HttpStatus } from '@nestjs/common';
import { ProjectStatus } from '@clever-launch/data';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProjectCantReceiveFunding extends HttpException {
  constructor(projectStatus: ProjectStatus) {
    super(
      {
        message: `Project status is ${projectStatus} and can't receive funding`,
        errorCode:
          CleverLaunchExceptionCode.PROJECT_STATUS_NOT_AVAILABLE_FOR_FUNDING,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
