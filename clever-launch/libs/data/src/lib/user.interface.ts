export interface User {
  // User's wallet public key
  id: string;
  eKycStatus: EkycStatus;
  authNonce: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  ekycFailedReason?: string;
}

export enum EkycStatus {
  NotStarted = 'NotStarted',
  InReview = 'InReview',
  ReviewFailed = 'ReviewFailed',
  Successful = 'Successful',
}
