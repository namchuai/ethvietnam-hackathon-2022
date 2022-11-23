import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Profile } from '@clever-launch/data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileExtender } from '../utils/file-extender.interceptor';
import { GetUserResponseDto } from './dtos/get-user-response.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { SubmitEkycInputDto } from './dtos/submit-ekyc-input.dto';
import { UpdateProfileInput } from './dtos/update-profile-input.dto';
import { UsersService } from './users.service';
import { ApproveEkycInputDto } from './dtos/approve-ekyc-input.dto';
import { RejectEkycInputDto } from './dtos/reject-ekyc-input.dto';
import { ApiImageFile } from '../decorators/api-file.decorator';

@Controller('users')
@ApiTags('Users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:ethKey')
  async getUser(@Param() params: GetUserDto): Promise<GetUserResponseDto> {
    const { ethKey } = params;
    return this.usersService.getUserOrThrow(ethKey);
  }

  @Post('upload/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiImageFile('image', true)
  async uploadUserAvatar(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadAvatar(file.buffer, request.user.id);
  }

  @Post('upload/ekyc/front')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
  async uploadUserKycFront(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadUserKycFront(file.buffer, request.user.id);
  }

  @Post('/upload/ekyc/back')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
  async uploadUserKycBack(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadUserKycBack(file.buffer, request.user.id);
  }

  @Post('/upload/ekyc/selfie')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
  async uploadUserKycSelfie(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadUserKycSelfie(file.buffer, request.user.id);
  }

  @Post('ekyc-submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submitEkyc(@Req() request, @Body() body: SubmitEkycInputDto) {
    const userId = request.user.id;
    return this.usersService.submitEkyc(userId, body);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @Req() request,
    @Body() body: UpdateProfileInput
  ): Promise<Profile> {
    const userId = request.user.id;
    return this.usersService.updateProfile(userId, body);
  }

  @Get('profile/:ethKey')
  async getProfile(@Param() params: GetUserDto): Promise<Profile> {
    const { ethKey } = params;
    return this.usersService.getProfileOrThrow(ethKey);
  }

  @Post('ekyc/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async approveEkyc(
    @Req() request,
    @Body() payload: ApproveEkycInputDto
  ): Promise<void> {
    const ethKey: string = request.user.id;
    const { ekycRequestUserId } = payload;
    return this.usersService.approveEkyc(ethKey, ekycRequestUserId);
  }

  @Post('ekyc/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async rejectEkyc(
    @Req() request,
    @Body() payload: RejectEkycInputDto
  ): Promise<void> {
    const ethKey: string = request.user.id;
    const { ekycRequestUserId, reason } = payload;
    return this.usersService.rejectEkyc(ethKey, ekycRequestUserId, reason);
  }
}
