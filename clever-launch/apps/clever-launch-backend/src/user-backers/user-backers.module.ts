import { Module } from '@nestjs/common';
import { ChainModule } from '../chain/chain.module';
import { DynamoModule } from '../dynamo/dynamo.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { UserBackersController } from './user-backers.controller';
import { UserBackersRepository } from './user-backers.repository';
import { UserBackersService } from './user-backers.service';

@Module({
  imports: [UsersModule, ProjectsModule, DynamoModule, ChainModule],
  controllers: [UserBackersController],
  providers: [UserBackersService, UserBackersRepository],
  exports: [UserBackersService],
})
export class UserBackersModule {}
