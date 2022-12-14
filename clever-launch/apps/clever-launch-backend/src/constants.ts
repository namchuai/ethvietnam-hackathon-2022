// For configuration
export const MAX_AVATAR_SIZE_IN_BYTE = 5 * 1024 * 1024;

export const AWS_REGION = 'ap-southeast-1';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const AWS_SSM = 'AWS_SSM';
export const ENV = 'prod';
export const JWT_SECRET = 'secretKey'; // TODO: change before release
export const SSM_PATH = `/clever-launch-backend/${ENV}/`;
export const AWS_CREDENTIAL = `${SSM_PATH}aws-credential`;
export const BLOCK_CHAIN_URL_PROVIDER = `${SSM_PATH}chain-url-provider`;
export const CL_PUBLIC_ADDRESS = `${SSM_PATH}public-address`;
export const CL_PRIVATE_KEY = `${SSM_PATH}private-key`;
export const CL_CONTRACT_ADDRESS = `${SSM_PATH}contract-address`;
export const CL_TOKEN_ADDRESS = `${SSM_PATH}token-address`;
export const PUBLIC_BUCKET_NAME = 'clever-launch-public';
export const PRIVATE_BUCKET_NAME = 'clever-launch-private';
export const USER_TABLE = `users-${ENV}`;
export const ADVISOR_TABLE = `advisors-${ENV}`;
export const MEMBER_TABLE = `members-${ENV}`;
export const PROJECT_TABLE = `projects-${ENV}`;
export const BACKER_TABLE = `backers-${ENV}`;
export const PROJECT_TAG_TABLE = `project-tags-${ENV}`;
export const EMAIL_SUBSCRIBER_TABLE = `email-subscribers-${ENV}`;
export const REWARD_TABLE = `rewards-${ENV}`;
export const EKYC_REQUEST_TABLE = `ekyc-requests-${ENV}`;
export const PENDING_PROJECT_TABLE = `pending-projects-${ENV}`;
export const REWARD_LOCK_TABLE = `reward-lock-${ENV}`;
export const PROJECT_DETAIL_TABLE = `project-detail-${ENV}`;
export const TRANSACTION_TABLE = `transactions-${ENV}`;
export const PROFILE_TABLE = `profiles-${ENV}`;
export const PROJECT_UPDATE_TABLE = `project-updates-${ENV}`;
export const PRIVILEGE_TABLE = `user-privileges-${ENV}`;
export const USER_EKYC_TABLE = `user-ekyc-${ENV}`;
export const USER_BACKER_TABLE = `user-backers-${ENV}`;
export const ALL_PROJECT_LIMIT = 12;
export const FEATURED_PROJECT_LIMIT = 6;
export const DELIVERY_YEAR_LIMIT = 5;
