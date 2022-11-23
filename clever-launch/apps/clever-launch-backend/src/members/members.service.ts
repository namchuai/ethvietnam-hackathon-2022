import { Injectable } from '@nestjs/common';
import { Member } from '@clever-launch/data';
import { MembersRepository } from './members.repository';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async getAllMembers(): Promise<Member[]> {
    const members = (await this.membersRepository.getAllMembers()).sort(
      (left, right) => {
        if (left.position > right.position) {
          return 1;
        }

        if (left.position < right.position) {
          return -1;
        }

        return 0;
      }
    );
    return members;
  }
}
