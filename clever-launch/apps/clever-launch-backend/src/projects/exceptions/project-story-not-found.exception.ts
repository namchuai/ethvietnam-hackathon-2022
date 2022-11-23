import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class ProjectStoryNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: 'Project story not found',
        errorCode: CleverLaunchExceptionCode.PROJECT_STORY_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
