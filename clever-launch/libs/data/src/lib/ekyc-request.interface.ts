export interface EkycRequest {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  countryOfResidence: string;
  frontUrl: string;
  backUrl: string;
  selfie: string;
  createdAt: number;
}

export type EkycRequestInput = Omit<
  EkycRequest,
  'createdAt' | 'updatedAt' | 'updatedById' | 'message'
>;
