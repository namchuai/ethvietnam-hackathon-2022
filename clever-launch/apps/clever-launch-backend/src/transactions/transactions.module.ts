import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { ChainModule } from '../chain/chain.module';
import { ProjectsModule } from '../projects/projects.module';
import { RewardsModule } from '../rewards/rewards.module';
import { DynamoModule } from '../dynamo/dynamo.module';
import { UsersModule } from '../users/users.module';
import { TransactionValidatorService } from './transaction-validator.service';
import { UserBackersModule } from '../user-backers/user-backers.module';

@Module({
  imports: [
    ChainModule,
    ProjectsModule,
    RewardsModule,
    DynamoModule,
    UsersModule,
    UserBackersModule
  ],
  providers: [
    TransactionsService,
    TransactionsRepository,
    TransactionValidatorService,
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
