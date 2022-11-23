import { Module } from '@nestjs/common';
import { AdvisorsModule } from '../advisors/advisors.module';
import { AuthModule } from '../auth/auth.module';
import { BackersModule } from '../backers/backers.module';
import { ChainModule } from '../chain/chain.module';
import { ConfigModule } from '../config/config.module';
import { MembersModule } from '../members/members.module';
import { ProjectTagsModule } from '../project-tags/project-tags.module';
import { ProjectsModule } from '../projects/projects.module';
import { RewardsModule } from '../rewards/rewards.module';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { UtilitiesModule } from '../utilities/utilities.module';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrivilegesModule } from '../privileges/privileges.module';
import { TokenModule } from '../token/token.module';
import { SmartContractModule } from '../smart-contract/smart-contract.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.register({}),
    AuthModule,
    ProjectsModule,
    UsersModule,
    ChainModule,
    SubscribersModule,
    AdvisorsModule,
    MembersModule,
    BackersModule,
    ProjectTagsModule,
    RewardsModule,
    TransactionsModule,
    UtilitiesModule,
    PrivilegesModule,
    TokenModule,
    SmartContractModule,
    AdminModule,
  ],
  providers: [AppService],
})
export class AppModule {}
