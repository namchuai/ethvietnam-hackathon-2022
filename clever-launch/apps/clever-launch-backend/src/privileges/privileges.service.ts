import { Injectable } from '@nestjs/common';
import { CLPrivilege, UserPrivilege } from '@clever-launch/data';
import { PrivilegesRepository } from './privileges.repository';
import { ChainService } from '../chain/chain.service';
import { UserDoNotHavePermissionException } from './exceptions/user-do-not-have-permission.exception';

@Injectable()
export class PrivilegesService {
  constructor(
    private readonly privilegesRepository: PrivilegesRepository,
    private readonly chainService: ChainService
  ) {}

  async isUserHavePermissionFor(
    userId: string,
    privilege: string
  ): Promise<boolean> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const user = await this.privilegesRepository.getUserPrivileges(
      normalizedUserId
    );
    if (!user) {
      throw new UserDoNotHavePermissionException();
    }
    return Object.values<string>(CLPrivilege).includes(privilege);
  }

  async setUserPrivilege(item: UserPrivilege): Promise<void> {
    return this.privilegesRepository.setUserPrivilege(item);
  }
}
