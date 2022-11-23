import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackerDto } from './dtos/backer.dto';
import { Backer } from '@clever-launch/data';
import { BackersService } from './backers.service';

@Controller('backers')
@ApiTags('Backers')
export class BackersController {
  constructor(private readonly backersService: BackersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: BackerDto,
    isArray: true,
    description: 'Return backers',
  })
  async getBackers(): Promise<Backer[]> {
    return this.backersService.getBackers();
  }
}
