import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserEkycNotSuccessException extends HttpException {
  constructor() {
    super(
      {
        message: 'User ekyc not success yet',
        errorCode: CleverLaunchExceptionCode.EKYC_NOT_SUCCESS,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
