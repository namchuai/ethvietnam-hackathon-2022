import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { ProjectsRepository } from './projects.repository';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { ChainModule } from '../chain/chain.module';
import { PrivilegesModule } from '../privileges/privileges.module';
import { SmartContractModule } from '../smart-contract/smart-contract.module';
import { ProjectWatchmanService } from './projects-watchman.service';

@Module({
  imports: [
    DynamoModule,
    StorageModule,
    UsersModule,
    ChainModule,
    PrivilegesModule,
    SmartContractModule,
  ],
  providers: [ProjectsService, ProjectsRepository, ProjectWatchmanService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
