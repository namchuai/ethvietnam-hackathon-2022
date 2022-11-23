import { HttpException, HttpStatus } from '@nestjs/common';
import { CleverLaunchExceptionCode } from '../../clever-launch-exception.code';

export class UserEkycAlreadySuccessException extends HttpException {
  constructor() {
    super(
      {
        message: 'User already ekyc successfully',
        errorCode: CleverLaunchExceptionCode.EKYC_ALREADY_SUCCESS,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
