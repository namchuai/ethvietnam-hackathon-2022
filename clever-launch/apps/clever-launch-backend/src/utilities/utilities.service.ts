import { Injectable } from '@nestjs/common';
import { ChainService } from '../chain/chain.service';
import { GeneratedWallet } from '../chain/dtos/generated-wallet.interface';
import { ConfigService } from '../config/config.service';
import { DELIVERY_YEAR_LIMIT } from '../constants';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UtilitiesService {
  constructor(
    private readonly chainService: ChainService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService
  ) {}

  async signMessage(message: string, privateKey: string): Promise<string> {
    return this.chainService.signMessage(message, privateKey);
  }

  getRewardDeliveryYears(): number[] {
    const currentYear = new Date().getFullYear();
    const ret: number[] = [];

    for (let i = 0; i < DELIVERY_YEAR_LIMIT; i++) {
      ret.push(currentYear + i);
    }

    return ret;
  }

  async getCountries(): Promise<string[]> {
    // TODO: store this in database
    return ['Vietnam', 'Thailand'];
  }

  generateNewWallet(): GeneratedWallet {
    return this.chainService.generateNewWallet();
  }

  async uploadMedium(buffer: Buffer): Promise<string> {
    return this.storageService.uploadBlogMedium(buffer);
  }

  getClTokenAddress(): string {
    return this.configService.clTokenAddress;
  }

  getClContractAddress(): string | PromiseLike<string> {
    return this.configService.clContractAddress;
  }
}
