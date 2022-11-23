export interface ProjectBacker {
  projectId: string;
  projectName: string;

  backerPublicKey: string;
  backerName?: string;
  backerAvatarUrl?: string;

  amount: string;

  createdAt: number;
}
