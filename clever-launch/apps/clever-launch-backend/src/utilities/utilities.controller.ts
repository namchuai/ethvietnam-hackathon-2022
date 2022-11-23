import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GeneratedWallet } from '../chain/dtos/generated-wallet.interface';
import { FileExtender } from '../utils/file-extender.interceptor';
import { SignMessageInputDto } from './dtos/sign-message-input.dto';
import { UtilitiesService } from './utilities.service';

@Controller('utilities')
@ApiTags('Utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Get('sign-message')
  async signMessage(@Query() query: SignMessageInputDto): Promise<string> {
    const { message, privateKey } = query;
    return this.utilitiesService.signMessage(message, privateKey);
  }

  @Get('reward-delivery-years')
  async getRewardDeliveryYears(): Promise<number[]> {
    return this.utilitiesService.getRewardDeliveryYears();
  }

  @Get('countries')
  async getCountries(): Promise<string[]> {
    return this.utilitiesService.getCountries();
  }

  @Get('new-wallet')
  async generateNewWallet(): Promise<GeneratedWallet> {
    return this.utilitiesService.generateNewWallet();
  }

  @Post('upload/medium')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProjectMedium(@UploadedFile() file: Express.Multer.File) {
    return this.utilitiesService.uploadMedium(file.buffer);
  }

  @Get('contract-address')
  async getClContractAddress(): Promise<string> {
    return this.utilitiesService.getClContractAddress();
  }

  @Get('token-address')
  async getClTokenAddress(): Promise<string> {
    return this.utilitiesService.getClTokenAddress();
  }
}
