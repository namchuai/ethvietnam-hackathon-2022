export interface ProjectUpdate {
  id: string;

  projectUpdateNumber: number;

  projectId: string;

  creatorId: string;

  creatorName: string;

  content: string;

  createdAt: number;

  updatedAt?: number;

  status: ProjectUpdateStatus;

  avatarUrl?: string;
}

export enum ProjectUpdateStatus {
  Available = 'Available',
  Removed = 'Removed',
}

export enum ProjectUpdateIndex {
  ProjectIndex = 'ProjectIndex',
}
