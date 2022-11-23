import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-default-tables')
  async createDefaultTables(): Promise<void> {
    return this.adminService.createDefaultTables();
  }

  @Post('delete-default-tables')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteDefaultTables(@Req() request): Promise<void> {
    const userId: string = request.user.id;
    return this.adminService.deleteDefaultTables(userId);
  }

  @Post('insert-seed-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async insertSeedData(@Req() request): Promise<void> {
    const userId: string = request.user.id;
    return this.adminService.insertSeedData(userId);
  }
}
