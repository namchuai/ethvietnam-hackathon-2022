export interface RewardLock {
  transactionHash: string;
  rewardId: string;
  projectId: string;
  userId: string;
  rewardLockStatus: RewardLockStatus;
  revertReason?: string;
  createdAt: number;
  updatedAt?: number;
}

export enum RewardLockStatus {
  Validating = 'Validating',
  Reverted = 'Reverted',
  Success = 'Success',
}
