import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UsersModule } from '../users/users.module';
import { ChainModule } from '../chain/chain.module';
import { PrivilegesModule } from '../privileges/privileges.module';

@Module({
  imports: [UsersModule, ChainModule, PrivilegesModule],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
