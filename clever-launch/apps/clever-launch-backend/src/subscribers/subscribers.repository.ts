import { Injectable } from '@nestjs/common';
import { EmailSubscriber, SubscribeStatus } from '@clever-launch/data';
import { DynamoService } from '../dynamo/dynamo.service';
import { EMAIL_SUBSCRIBER_TABLE } from '../constants';

@Injectable()
export class SubscribersRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async subscribeEmail(item: EmailSubscriber): Promise<void> {
    return this.dynamoService.put({
      TableName: EMAIL_SUBSCRIBER_TABLE,
      Item: item,
      ConditionExpression: '#status = :unsubscribed',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':unsubscribed': SubscribeStatus.Unsubscribe,
      },
    });
  }

  async getEmailSubscriber(
    email: string
  ): Promise<EmailSubscriber | undefined> {
    const ret = await this.dynamoService.get({
      TableName: EMAIL_SUBSCRIBER_TABLE,
      Key: { email: email },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as EmailSubscriber;
  }

  async unsubscribeEmail(email: string): Promise<void> {
    await this.dynamoService.update({
      TableName: EMAIL_SUBSCRIBER_TABLE,
      Key: { email: email },
      UpdateExpression: 'SET #status = :newStatus',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':newStatus': SubscribeStatus.Unsubscribe,
      },
    });
  }
}
