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
import { ApproveSpenderInputDto } from './dtos/approve-spender-input.dto';
import { GiveAwayInputDto } from './dtos/give-away-input.dto';
import { TokenService } from './token.service';

@Controller('token')
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('balance/:userId')
  async getBalanceOfUser(@Param('userId') userId: string): Promise<string> {
    return this.tokenService.balanceOf(userId);
  }

  @Get('clever-launch/balance')
  async getCleverLaunchBalance(): Promise<string> {
    return this.tokenService.getCleverLaunchBalance();
  }

  @Post('approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async approveSpender(
    @Req() request,
    @Body() payload: ApproveSpenderInputDto
  ): Promise<string> {
    const userId = request.user.id;
    return this.tokenService.approve(userId, payload);
  }

  @Post('give-away')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async giveAwayClt(
    @Req() request,
    @Body() payload: GiveAwayInputDto
  ): Promise<string> {
    const userId = request.user.id;
    return this.tokenService.giveAway(userId, payload);
  }
}
