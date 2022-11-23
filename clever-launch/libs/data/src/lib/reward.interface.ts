export interface Reward {
  id: string;
  projectId: string;
  createdAt: number;
  title: string;
  totalAmount: number;
  amountLeft: number;
  price: number;
  description: string;
  estDeliveryMonth: number;
  estDeliveryYear: number;
  rewardType: RewardType;
  rewardStatus: RewardStatus;
  deliveryNote?: string;
  updatedAt?: number;
}

export enum RewardType {
  Physical = 'Physical',
  Digital = 'Digital',
  PhysicalAndDigital = 'Physical and digital',
}

export enum RewardStatus {
  Available = 'Available',
  Removed = 'Removed',
}

export enum RewardIndex {
  ProjectIndex = 'ProjectIndex',
}
