import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserBackerProject } from '@clever-launch/data';
import { GetUserDto } from '../users/dtos/get-user.dto';
import { UserBackersService } from './user-backers.service';

@Controller('user-backers')
@ApiTags('User backers')
export class UserBackersController {
  constructor(private readonly userBackersService: UserBackersService) {}

  @Get('backers/:ethKey')
  async getUserBackers(
    @Param() params: GetUserDto
  ): Promise<UserBackerProject[]> {
    const { ethKey } = params;
    return this.userBackersService.getUserBackers(ethKey);
  }
}
