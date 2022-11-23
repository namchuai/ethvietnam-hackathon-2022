export interface CLTransaction {
  transactionHash: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  creatorId: string;
  amount: number;
  transactionStatus: TransactionStatus;
  createdAt: number;
  updatedAt?: number;
  rewardId?: string;
  rewardName?: string;
  invalidReason?: string;
  blockNumber?: number;
  blockHash?: string;
}

export enum TransactionStatus {
  Submitted = 'Submitted',
  Invalid = 'Invalid',
  Valid = 'Valid',
}

export enum CLTransactionIndex {
  UserTransactionIndex = 'UserTransactionIndex',
  ProjectTransactionIndex = 'ProjectTransactionIndex',
  TransactionHashIndex = 'TransactionHashIndex',
  TransactionStatusIndex = 'TransactionStatusIndex',
}
