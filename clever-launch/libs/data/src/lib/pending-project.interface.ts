import { ProjectTag } from './project-tag.interface';
import { FundRaisingMethod, IntroType } from './project.interface';

export interface PendingProject {
  creatorId: string;

  projectId: string;

  title?: string;

  subTitle?: string;

  introType: IntroType;

  introUrl?: string;

  fundRaisingMethod: FundRaisingMethod;

  fundingGoal?: number;

  durationInDay?: number;

  pitchDeckUrl?: string;

  tags?: ProjectTag[];

  story?: string;

  walletAddress?: string;

  contactEmail?: string;

  updatedAt?: number;

  createdAt: number;
}

export enum PendingProjectIndex {
  ProjectIdIndex = 'ProjectIdIndex',
}
