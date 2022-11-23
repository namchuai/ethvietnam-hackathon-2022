import {
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  advisorsCreateTableCommandInput,
  advisorsDeleteTableCommandInput,
} from './advisors.table';
import {
  backersCreateTableCommandInput,
  backersDeleteTableCommandInput,
} from './backers.table';
import {
  ekycRequestsCreateTableCommandInput,
  ekycRequestsDeleteTableCommandInput,
} from './ekyc-requests.table';
import {
  emailSubscribersCreateTableCommandInput,
  emailSubscribersDeleteTableCommandInput,
} from './email-subscribers.table';
import {
  membersCreateTableCommandInput,
  membersDeleteTableCommandInput,
} from './members.table';
import {
  pendingProjectsCreateTableCommandInput,
  pendingProjectsDeleteTableCommandInput,
} from './pending-projects.table';
import {
  profilesCreateTableCommandInput,
  profilesDeleteTableCommandInput,
} from './profiles.table';
import {
  projectDetailCreateTableCommandInput,
  projectDetailDeleteTableCommandInput,
} from './project-detail.table';
import {
  projectTagsCreateTableCommandInput,
  projectTagsDeleteTableCommandInput,
} from './project-tags.table';
import {
  projectUpdatesCreateTableCommandInput,
  projectUpdatesDeleteTableCommandInput,
} from './project-updates.table';
import {
  projectsCreateTableCommandInput,
  projectsDeleteTableCommandInput,
} from './projects.table';
import {
  rewardLocksCreateTableCommandInput,
  rewardLocksDeleteTableCommandInput,
} from './reward-locks.table';
import {
  rewardsCreateTableCommandInput,
  rewardsDeleteTableCommandInput,
} from './rewards.table';
import {
  transactionsCreateTableCommandInput,
  transactionsDeleteTableCommandInput,
} from './transactions.table';
import {
  userBackersCreateTableCommandInput,
  userBackersDeleteTableCommandInput,
} from './user-backers.table';
import {
  userEkycCreateTableCommandInput,
  userEkycDeleteTableCommandInput,
} from './user-ekyc.table';
import {
  userPrivilegesCreateTableCommandInput,
  userPrivilegesDeleteTableCommandInput,
} from './user-privileges.table';
import {
  usersCreateTableCommandInput,
  usersDeleteTableCommandInput,
} from './users.table';

export const createCommandInputs: CreateTableCommandInput[] = [
  advisorsCreateTableCommandInput,
  backersCreateTableCommandInput,
  ekycRequestsCreateTableCommandInput,
  emailSubscribersCreateTableCommandInput,
  membersCreateTableCommandInput,
  pendingProjectsCreateTableCommandInput,
  profilesCreateTableCommandInput,
  projectDetailCreateTableCommandInput,
  projectTagsCreateTableCommandInput,
  projectUpdatesCreateTableCommandInput,
  projectsCreateTableCommandInput,
  rewardLocksCreateTableCommandInput,
  rewardsCreateTableCommandInput,
  transactionsCreateTableCommandInput,
  userBackersCreateTableCommandInput,
  userEkycCreateTableCommandInput,
  userPrivilegesCreateTableCommandInput,
  usersCreateTableCommandInput,
];

export const deleteCommandInputs: DeleteTableCommandInput[] = [
  advisorsDeleteTableCommandInput,
  backersDeleteTableCommandInput,
  ekycRequestsDeleteTableCommandInput,
  emailSubscribersDeleteTableCommandInput,
  membersDeleteTableCommandInput,
  pendingProjectsDeleteTableCommandInput,
  profilesDeleteTableCommandInput,
  projectDetailDeleteTableCommandInput,
  projectTagsDeleteTableCommandInput,
  projectUpdatesDeleteTableCommandInput,
  projectsDeleteTableCommandInput,
  rewardLocksDeleteTableCommandInput,
  rewardsDeleteTableCommandInput,
  transactionsDeleteTableCommandInput,
  userBackersDeleteTableCommandInput,
  userEkycDeleteTableCommandInput,
  userPrivilegesDeleteTableCommandInput,
  usersDeleteTableCommandInput,
];
