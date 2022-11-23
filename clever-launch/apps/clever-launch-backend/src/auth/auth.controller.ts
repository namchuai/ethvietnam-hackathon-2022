import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthenticateWalletResponseDto } from './dtos/authenticate-wallet-response.dto';
import { AuthenticateWalletDto } from './dtos/authenticate-wallet.dto';
import { GetAuthWalletNonceResponseDto } from './dtos/get-auth-wallet-nonce-response.dto';
import { GetAuthWalletNonceDto } from './dtos/get-auth-wallet-nonce.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('nonce')
  async getAuthWalletNonce(
    @Body() getWalletNonceDto: GetAuthWalletNonceDto
  ): Promise<GetAuthWalletNonceResponseDto> {
    const { ethKey } = getWalletNonceDto;
    const nonce = await this.authService.getAuthNonce(ethKey);
    return { nonce };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('wallet')
  async authenticateWallet(
    @Body() authenticateWalletDto: AuthenticateWalletDto
  ): Promise<AuthenticateWalletResponseDto> {
    const { username } = authenticateWalletDto;
    const accessToken = await this.authService.authenticateWallet(username);
    return { accessToken };
  }
}
