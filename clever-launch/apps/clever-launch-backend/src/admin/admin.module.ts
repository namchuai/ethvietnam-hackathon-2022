import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { ChainModule } from '../chain/chain.module';
import { PrivilegesModule } from '../privileges/privileges.module';

@Module({
  imports: [DynamoModule, ChainModule, PrivilegesModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
