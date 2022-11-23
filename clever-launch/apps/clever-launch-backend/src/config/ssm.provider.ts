import {
  SSMClient,
  Parameter,
  GetParametersByPathCommand,
} from '@aws-sdk/client-ssm';
import { AWS_REGION, AWS_SSM, SSM_PATH } from '../constants';

export const ssmProvider = {
  provide: AWS_SSM,
  useFactory: async (): Promise<Parameter[]> => {
    const client = new SSMClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    });

    const result = await client.send(
      new GetParametersByPathCommand({
        Path: SSM_PATH,
      })
    );

    return result.Parameters ?? [];
  },
};
