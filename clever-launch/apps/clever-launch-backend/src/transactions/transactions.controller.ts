import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserDto } from '../users/dtos/get-user.dto';
import { CreateTransactionInputDto } from './dtos/create-transaction-input.dto';
import { CreateTransactionOutputDto } from './dtos/create-transaction-output.dto';
import { GetTransactionResponseDto } from './dtos/get-transaction-response.dto';
import { GetTransactionByProjectIdInputDto } from './dtos/get-transactions-by-project-id-input.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submitTransaction(
    @Req() request,
    @Body() createTransactionInput: CreateTransactionInputDto
  ): Promise<CreateTransactionOutputDto> {
    const userId = request.user.id;
    return this.transactionsService.createTransaction(
      userId,
      createTransactionInput
    );
  }

  @Get('users/:ethKey')
  async getUserTransactions(
    @Param() params: GetUserDto
  ): Promise<GetTransactionResponseDto[]> {
    const { ethKey } = params;
    return this.transactionsService.getUserTransaction(ethKey);
  }

  @Get('projects/:projectId')
  async getProjectTransactions(
    @Param() params: GetTransactionByProjectIdInputDto
  ): Promise<GetTransactionResponseDto[]> {
    const { projectId } = params;
    return this.transactionsService.getProjectTransactions(projectId);
  }
}
