import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { RewardsRepository } from './rewards.repository';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { ChainModule } from '../chain/chain.module';

@Module({
  imports: [DynamoModule, ProjectsModule, UsersModule, ChainModule],
  providers: [RewardsService, RewardsRepository],
  controllers: [RewardsController],
  exports: [RewardsService],
})
export class RewardsModule {}
