import { forwardRef, Module } from '@nestjs/common';
import { SmartContractService } from './smart-contract.service';
import { SmartContractController } from './smart-contract.controller';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [forwardRef(() => ProjectsModule), UsersModule],
  providers: [SmartContractService],
  controllers: [SmartContractController],
  exports: [SmartContractService],
})
export class SmartContractModule {}
