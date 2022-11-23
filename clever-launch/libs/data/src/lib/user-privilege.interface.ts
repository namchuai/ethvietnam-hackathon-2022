export interface UserPrivilege {
  // wallet public key
  userId: string;

  privileges: string[];
}

export enum CLPrivilege {
  ApproveEkyc = 'ApproveEkyc',
  ApproveProject = 'ApproveProject',
  SetPrivilege = 'SetPrivilege',
  GiveAway = 'GiveAway',
}
