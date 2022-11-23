import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectDepositInputDto } from './dtos/project-deposit-input.dto';
import { SmartContractService } from './smart-contract.service';

@Controller('smart-contract')
@ApiTags('Smart contract')
export class SmartContractController {
  constructor(private readonly smartContractService: SmartContractService) {}

  @Get('project-wallet/:projectId')
  async getProjectWallet(
    @Param('projectId') projectId: string
  ): Promise<string> {
    return this.smartContractService.getOnChainProjectWallet(projectId);
  }

  @Get('user-backed-amount/:userId/project/:projectId')
  async getOnChainUserBackedAmount(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string
  ): Promise<string> {
    return this.smartContractService.getOnChainUserBackedAmount(
      projectId,
      userId
    );
  }

  @Get('project-backed-amount/:projectId')
  async getOnChainProjectBackedAmount(
    @Param('projectId') projectId: string
  ): Promise<string> {
    return this.smartContractService.getOnChainProjectBackedAmount(projectId);
  }

  @Post('deposit/:projectId')
  async deposit(@Body() payload: ProjectDepositInputDto): Promise<string> {
    return this.smartContractService.deposit(payload);
  }
}
