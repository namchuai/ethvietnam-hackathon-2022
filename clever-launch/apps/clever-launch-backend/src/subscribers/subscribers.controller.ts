import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailSubscribeDto } from './dtos/email-subscribe.dto';
import { EmailUnsubscribeDto } from './dtos/email-unsubscribe.dto';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
@ApiTags('Subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  subscribeEmail(@Body() emailSubscribeDto: EmailSubscribeDto) {
    return this.subscribersService.subscribeEmail(emailSubscribeDto);
  }

  @Patch()
  unsubscribeEmail(@Body() emailUnsubscribeDto: EmailUnsubscribeDto) {
    return this.subscribersService.unsubscribeEmail(emailUnsubscribeDto.email);
  }
}
