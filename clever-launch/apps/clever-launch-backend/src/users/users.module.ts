import { Module } from '@nestjs/common';
import { ChainModule } from '../chain/chain.module';
import { DynamoModule } from '../dynamo/dynamo.module';
import { PrivilegesModule } from '../privileges/privileges.module';
import { StorageModule } from '../storage/storage.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DynamoModule, ChainModule, StorageModule, PrivilegesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
