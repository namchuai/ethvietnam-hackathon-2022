import { Injectable } from '@nestjs/common';
import { UserPrivilege } from '@clever-launch/data';
import { ChainService } from '../chain/chain.service';
import { DynamoService } from '../dynamo/dynamo.service';
import { UserDoNotHavePermissionException } from '../privileges/exceptions/user-do-not-have-permission.exception';
import { PrivilegesService } from '../privileges/privileges.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DynamoService,
    private readonly chainService: ChainService,
    private readonly privilegesService: PrivilegesService,
    private readonly configService: ConfigService
  ) {}

  async createDefaultTables(): Promise<void> {
    return this.databaseService.createDefaultTables();
  }

  async deleteDefaultTables(userId: string): Promise<void> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    if (normalizedUserId !== this.configService.clPublicAddress) {
      throw new UserDoNotHavePermissionException();
    }
    return this.databaseService.deleteDefaultTables();
  }

  async insertSeedData(userId: string): Promise<void> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    if (normalizedUserId !== this.configService.clPublicAddress) {
      throw new UserDoNotHavePermissionException();
    }
    for (const privilege of this.privilegesData()) {
      this.privilegesService.setUserPrivilege(privilege);
    }
  }

  private privilegesData(): UserPrivilege[] {
    const allPrivileges = ['ApproveEkyc', 'ApproveProject', 'SetPrivilege'];
    const privilegesData: UserPrivilege[] = [
      {
        userId: '0xe774a1273c4b814db20128b7ce96a6ff98940388',
        privileges: allPrivileges,
      },
      {
        userId: '0xbca7ea6f9806d6044118e428df0d156356f59358',
        privileges: allPrivileges,
      },
      {
        userId: '0x539e04652385a048e920fd98503afaf880a00f6c',
        privileges: allPrivileges,
      },
      {
        userId: '0xaa015808e5a83c8d016ac717cbdc20655ce5bd82',
        privileges: allPrivileges,
      },
    ];
    return privilegesData;
  }
}
