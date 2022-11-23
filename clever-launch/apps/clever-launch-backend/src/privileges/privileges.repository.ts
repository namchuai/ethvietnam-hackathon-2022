import { Injectable } from '@nestjs/common';
import { UserPrivilege } from '@clever-launch/data';
import { PRIVILEGE_TABLE } from '../constants';
import { DynamoService } from '../dynamo/dynamo.service';

@Injectable()
export class PrivilegesRepository {
  constructor(private readonly databaseService: DynamoService) {}

  async getUserPrivileges(userId: string): Promise<UserPrivilege | undefined> {
    const ret = await this.databaseService.get({
      TableName: PRIVILEGE_TABLE,
      ConsistentRead: true,
      Key: { userId: userId },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as UserPrivilege;
  }

  async setUserPrivilege(item: UserPrivilege): Promise<void> {
    await this.databaseService.put({
      TableName: PRIVILEGE_TABLE,
      Item: item,
    });
  }
}
