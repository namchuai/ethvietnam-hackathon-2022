import { Module } from '@nestjs/common';
import { AdvisorsService } from './advisors.service';
import { AdvisorsController } from './advisors.controller';
import { AdvisorsRepository } from './advisors.repository';
import { DynamoModule } from '../dynamo/dynamo.module';

@Module({
  imports: [DynamoModule],
  providers: [AdvisorsService, AdvisorsRepository],
  controllers: [AdvisorsController],
})
export class AdvisorsModule {}
