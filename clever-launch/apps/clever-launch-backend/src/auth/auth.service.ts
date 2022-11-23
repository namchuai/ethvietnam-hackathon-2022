import crypto = require('crypto');
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ChainService } from '../chain/chain.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidSignatureException } from '../exceptions/invalid-signature.exception';
import { User } from '@clever-launch/data';
import { UserAuthNonceEmptyException } from '../users/exceptions/user-auth-nonce-empty.exception';
import { TokenPayload } from './dtos/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly chainService: ChainService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async getAuthNonce(ethKey: string): Promise<number> {
    const normalizedKey =
      this.chainService.normalizeUserInputEthAddress(ethKey);
    const user = await this.usersService.getUser(normalizedKey);
    const nonce = this.getAuthRandomNonce();

    if (!user) {
      await this.usersService.createUser(normalizedKey, nonce);
    } else {
      await this.usersService.updateUserAuthNonce(normalizedKey, nonce);
    }

    return nonce;
  }

  async verifyWallet(ethKey: string, signature: string): Promise<User> {
    const normalizedKey =
      this.chainService.normalizeUserInputEthAddress(ethKey);
    const user = await this.usersService.getUserOrThrow(normalizedKey);

    if (user.authNonce === -1) {
      throw new UserAuthNonceEmptyException();
    }

    const recoveredAddress = await this.chainService.recoverAddress(
      `${user.authNonce}`,
      signature
    );

    if (normalizedKey !== recoveredAddress.toLowerCase()) {
      throw new InvalidSignatureException();
    }

    return user;
  }

  async authenticateWallet(ethKey: string): Promise<string> {
    const normalizedKey =
      this.chainService.normalizeUserInputEthAddress(ethKey);
    const payload: TokenPayload = {
      userId: normalizedKey,
    };

    await this.usersService.updateUserAuthNonce(normalizedKey, -1);
    return this.jwtService.sign(payload);
  }

  private getAuthRandomNonce(): number {
    return crypto.randomInt(0, 1000000);
  }
}
