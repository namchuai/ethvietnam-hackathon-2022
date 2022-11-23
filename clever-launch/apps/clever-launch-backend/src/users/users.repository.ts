import { TransactWriteItemsCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { EkycRequest, EkycStatus, Profile, User } from '@clever-launch/data';
import { Injectable } from '@nestjs/common';
import {
  EKYC_REQUEST_TABLE,
  PROFILE_TABLE,
  USER_EKYC_TABLE,
  USER_TABLE,
} from '../constants';
import { DynamoService } from '../dynamo/dynamo.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async getUser(userId: string): Promise<User | undefined> {
    const result = await this.dynamoService.get({
      TableName: USER_TABLE,
      Key: { id: userId },
    });

    if (result.Item) {
      return result.Item as User;
    }
    return undefined;
  }

  async updateAuthNonce(id: string, nonce: number): Promise<void> {
    await this.dynamoService.update({
      TableName: USER_TABLE,
      Key: { id: id },
      UpdateExpression: 'SET authNonce = :authNonce',
      ExpressionAttributeValues: {
        ':authNonce': nonce,
      },
    });
  }

  async createUser(user: User): Promise<void> {
    await this.dynamoService.put({
      TableName: USER_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)',
    });
  }

  async submitEkyc(item: EkycRequest): Promise<void> {
    const { userId } = item;
    const tx: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Update: {
            TableName: USER_TABLE,
            Key: marshall({ id: userId }),
            UpdateExpression:
              'SET eKycStatus = :inReview' +
              ', firstName = :firstName' +
              ', lastName = :lastName' +
              ', dateOfBirth = :dob',
            ConditionExpression:
              'eKycStatus <> :eKycSuccess AND ' + 'eKycStatus <> :inReview',
            ExpressionAttributeValues: marshall({
              ':inReview': EkycStatus.InReview,
              ':eKycSuccess': EkycStatus.Successful,
              ':firstName': item.firstName,
              ':lastName': item.lastName,
              ':dob': item.dateOfBirth,
            }),
          },
        },
        {
          Put: {
            TableName: EKYC_REQUEST_TABLE,
            Item: marshall(item),
            ConditionExpression: 'attribute_not_exists(userId)',
          },
        },
      ],
    };
    await this.dynamoService.transactWrite(tx);
  }

  async getEkycRequest(userId: string): Promise<EkycRequest | undefined> {
    const ret = await this.dynamoService.get({
      TableName: EKYC_REQUEST_TABLE,
      Key: { userId: userId },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as EkycRequest;
  }

  async updateProfile(profile: Profile): Promise<void> {
    await this.dynamoService.put({
      TableName: PROFILE_TABLE,
      Item: profile,
    });
  }

  async updateAvatarUrl(id: string, avatarUrl: string): Promise<void> {
    await this.dynamoService.update({
      TableName: PROFILE_TABLE,
      Key: { id: id },
      UpdateExpression: 'SET avatarUrl = :avatarUrl',
      ExpressionAttributeValues: {
        ':avatarUrl': avatarUrl,
      },
    });
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    const ret = await this.dynamoService.get({
      TableName: PROFILE_TABLE,
      Key: { id: id },
    });
    if (!ret.Item) {
      return undefined;
    }
    return ret.Item as Profile;
  }

  async approveEkycRequest(
    ekycRequestUserId: string,
    item: EkycRequest
  ): Promise<void> {
    await this.dynamoService.transactWrite({
      TransactItems: [
        {
          Update: {
            TableName: USER_TABLE,
            Key: marshall({ id: ekycRequestUserId }),
            ConditionExpression: 'eKycStatus = :inReview',
            UpdateExpression: 'SET eKycStatus = :successful',
            ExpressionAttributeValues: marshall({
              ':inReview': EkycStatus.InReview,
              ':successful': EkycStatus.Successful,
            }),
          },
        },
        {
          Delete: {
            TableName: EKYC_REQUEST_TABLE,
            Key: marshall({ userId: ekycRequestUserId }),
          },
        },
        {
          Put: {
            TableName: USER_EKYC_TABLE,
            Item: marshall(item),
            ConditionExpression: 'attribute_not_exists(userId)',
          },
        },
      ],
    });
  }

  async rejectEkycRequest(
    ekycRequestUserId: string,
    reason: string
  ): Promise<void> {
    await this.dynamoService.transactWrite({
      TransactItems: [
        {
          Update: {
            TableName: USER_TABLE,
            Key: marshall({ id: ekycRequestUserId }),
            ConditionExpression: 'eKycStatus = :inReview',
            UpdateExpression:
              'SET eKycStatus = :reviewFailed' +
              ', ekycFailedReason = :reason' +
              ', firstName = :firstName' +
              ', lastName = :lastName' +
              ', dateOfBirth = :dob',
            ExpressionAttributeValues: marshall({
              ':inReview': EkycStatus.InReview,
              ':reviewFailed': EkycStatus.ReviewFailed,
              ':reason': reason,
              ':firstName': '',
              ':lastName': '',
              ':dob': '',
            }),
          },
        },
        {
          Delete: {
            TableName: EKYC_REQUEST_TABLE,
            Key: marshall({ userId: ekycRequestUserId }),
          },
        },
      ],
    });
  }
}
