import { Module } from '@nestjs/common';
import { ChainModule } from '../chain/chain.module';
import { DynamoModule } from '../dynamo/dynamo.module';
import { PrivilegesRepository } from './privileges.repository';
import { PrivilegesService } from './privileges.service';

@Module({
  imports: [ChainModule, DynamoModule],
  providers: [PrivilegesService, PrivilegesRepository],
  exports: [PrivilegesService],
})
export class PrivilegesModule {}
