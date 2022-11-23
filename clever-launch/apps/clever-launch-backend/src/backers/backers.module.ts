import { Module } from '@nestjs/common';
import { DynamoModule } from '../dynamo/dynamo.module';
import { BackersController } from './backers.controller';
import { BackersRepository } from './backers.repository';
import { BackersService } from './backers.service';

@Module({
  imports: [DynamoModule],
  controllers: [BackersController],
  providers: [BackersService, BackersRepository],
})
export class BackersModule {}
