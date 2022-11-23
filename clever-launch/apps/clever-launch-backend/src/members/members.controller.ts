import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberResponseDto } from './dtos/member-response.dto';
import { MembersService } from './members.service';
import { Member } from '@clever-launch/data';

@Controller('members')
@ApiTags('Members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: MemberResponseDto,
    isArray: true,
    description: 'Returns all members',
  })
  async getAllMembers(): Promise<Member[]> {
    return this.membersService.getAllMembers();
  }
}
