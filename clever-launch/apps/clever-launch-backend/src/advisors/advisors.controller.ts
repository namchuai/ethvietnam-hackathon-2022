import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdvisorsService } from './advisors.service';
import { AdvisorDto } from './dtos/advisor.dto';

@Controller('advisors')
@ApiTags('Advisors')
export class AdvisorsController {
  constructor(private readonly advisorsService: AdvisorsService) {}

  @Get()
  @ApiResponse({
    type: AdvisorDto,
    isArray: true,
  })
  async getAllAdvisors(): Promise<AdvisorDto[]> {
    return this.advisorsService.getAllAdvisors();
  }
}
