import { Parameter } from '@aws-sdk/client-ssm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import {
  AWS_SSM,
  CONFIG_OPTIONS,
  AWS_CREDENTIAL,
  BLOCK_CHAIN_URL_PROVIDER,
  CL_PUBLIC_ADDRESS,
  CL_PRIVATE_KEY,
  CL_CONTRACT_ADDRESS,
  CL_TOKEN_ADDRESS,
} from '../constants';

@Injectable()
export class ConfigService {
  private keyMapper = new Map<string, string>();

  constructor(
    @Inject(CONFIG_OPTIONS) options: ConfigModuleOptions,
    @Inject(AWS_SSM) awsParameters: Parameter[]
  ) {
    for (const param of awsParameters) {
      if (param.Name === AWS_CREDENTIAL) {
        this.keyMapper[AWS_CREDENTIAL] = param.Value;
        continue;
      }
      if (param.Name === BLOCK_CHAIN_URL_PROVIDER) {
        this.keyMapper[BLOCK_CHAIN_URL_PROVIDER] = param.Value;
        continue;
      }
      if (param.Name === CL_PUBLIC_ADDRESS) {
        this.keyMapper[CL_PUBLIC_ADDRESS] = param.Value;
        continue;
      }
      if (param.Name === CL_PRIVATE_KEY) {
        this.keyMapper[CL_PRIVATE_KEY] = param.Value;
        continue;
      }
      if (param.Name === CL_CONTRACT_ADDRESS) {
        this.keyMapper[CL_CONTRACT_ADDRESS] = param.Value;
        continue;
      }
      if (param.Name === CL_TOKEN_ADDRESS) {
        this.keyMapper[CL_TOKEN_ADDRESS] = param.Value;
        continue;
      }
    }
  }

  get awsCredential(): string {
    return this.keyMapper[AWS_CREDENTIAL];
  }

  get getChainUrlProvider(): string {
    return this.keyMapper[BLOCK_CHAIN_URL_PROVIDER];
  }

  get clPublicAddress(): string {
    return this.keyMapper[CL_PUBLIC_ADDRESS];
  }

  get clPrivateKey(): string {
    return this.keyMapper[CL_PRIVATE_KEY];
  }

  get clContractAddress(): string {
    return this.keyMapper[CL_CONTRACT_ADDRESS];
  }

  get clTokenAddress(): string {
    return this.keyMapper[CL_TOKEN_ADDRESS];
  }
}
