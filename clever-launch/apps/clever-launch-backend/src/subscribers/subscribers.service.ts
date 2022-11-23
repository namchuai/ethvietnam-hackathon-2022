import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  EmailSubscriber,
  SubscriberType,
  SubscribeStatus,
} from '@clever-launch/data';
import { EmailSubscribeDto } from './dtos/email-subscribe.dto';
import { SubscribersRepository } from './subscribers.repository';
import { getUtcTimestamp } from '../utils/date-time';
import { EmailAlreadySubscribedException } from './exceptions/email-already-subscribed.exception';
import { ConditionalCheckFailedException } from '../utils/dynamodb';
import { EmailSubscriberNotFoundException } from './exceptions/email-subscriber-not-found.exception';

@Injectable()
export class SubscribersService {
  constructor(private readonly subscribersRepository: SubscribersRepository) {}

  async subscribeEmail(emailSubscribeDto: EmailSubscribeDto) {
    const { email, subscriberType } = emailSubscribeDto;
    const timestamp = getUtcTimestamp();
    try {
      await this.subscribersRepository.subscribeEmail({
        email,
        subscriberType: subscriberType ?? SubscriberType.None,
        status: SubscribeStatus.Subscribe,
        updatedAt: timestamp,
      });

      return this.subscribersRepository.getEmailSubscriber(email);
    } catch (err) {
      if (err.name === ConditionalCheckFailedException) {
        throw new EmailAlreadySubscribedException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getEmailSubscriber(
    email: string
  ): Promise<EmailSubscriber | undefined> {
    return this.subscribersRepository.getEmailSubscriber(email);
  }

  async getEmailSubscriberOrThrow(email: string): Promise<EmailSubscriber> {
    const subscriber = await this.getEmailSubscriber(email);
    if (!subscriber) {
      throw new EmailSubscriberNotFoundException();
    }
    return subscriber;
  }

  async unsubscribeEmail(email: string): Promise<EmailSubscriber> {
    await this.subscribersRepository.unsubscribeEmail(email);
    return this.getEmailSubscriberOrThrow(email);
  }
}
