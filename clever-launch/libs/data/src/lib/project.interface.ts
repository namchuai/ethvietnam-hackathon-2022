import { ProjectTag } from './project-tag.interface';

export enum ProjectIndex {
  FeaturedPointIndex = 'FeaturedPointIndex',
  MyProjectIndex = 'MyProjectIndex',
  ApprovedAtIndex = 'ApprovedAtIndex',
  UserProjectStatusIndex = 'UserProjectStatusIndex',
  StatusApprovedAtIndex = 'StatusApprovedAtIndex',
  StatusCreatedAtIndex = 'StatusCreatedAtIndex',
}

export enum FundRaisingMethod {
  LookingForDonors = 'LookingForDonors',
  LookingForInvestors = 'LookingForInvestors',
}

export enum ProjectStatus {
  Created = 'Created',
  Validated = 'Validated',
  ValidationFailed = 'ValidationFailed',
  SuccessfulFundraising = 'SuccessfulFundraising',
  FailedFundraising = 'FailedFundraising',
  Removed = 'Removed',
}

export interface Project {
  creatorId: string;
  id: string;
  title: string;
  subTitle: string;
  introType: IntroType;
  introUrl: string;
  fundRaisingMethod: FundRaisingMethod;
  fundingGoal?: number;
  durationInDay?: number;
  pitchDeckUrl?: string;
  tags: ProjectTag[];
  walletAddress: string;
  contactEmail: string;
  updatedAt?: number;
  createdAt: number;
  creatorFirstName?: string;
  creatorLastName?: string;
  creatorProfileName?: string;
  status: ProjectStatus;
  approvedAt?: number;
  endAt?: number;
  featuredPoint: number;
  // used to overcome dynamodb's limitation of ordering
  // and pagination is not supported with scan api
  scannable: string;
  backerCount: number;
  fundedAmount: number;
  validationFailedReason?: string;
  createProjectTxHash?: string;
}

export enum IntroType {
  Image = 'Image',
  Video = 'Video',
}
