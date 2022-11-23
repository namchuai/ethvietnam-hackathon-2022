import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { SubscribersRepository } from './subscribers.repository';
import { DynamoModule } from '../dynamo/dynamo.module';

@Module({
  imports: [DynamoModule],
  providers: [SubscribersService, SubscribersRepository],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
