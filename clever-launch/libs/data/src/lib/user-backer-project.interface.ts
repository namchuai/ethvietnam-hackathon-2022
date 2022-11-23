import { Project } from './project.interface';
import { UserBacker } from './user-backer.interface';

export interface UserBackerProject extends UserBacker {
  project: Project;
}
