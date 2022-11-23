import { Module } from '@nestjs/common';
import { ChainModule } from '../chain/chain.module';
import { StorageModule } from '../storage/storage.module';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

@Module({
  imports: [ChainModule, StorageModule],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
