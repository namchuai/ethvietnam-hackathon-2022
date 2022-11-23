import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '../config/config.service';
import {
  AWS_REGION,
  PRIVATE_BUCKET_NAME,
  PUBLIC_BUCKET_NAME,
} from '../constants';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor(configService: ConfigService) {
    const credentials = configService.awsCredential.split(':');
    this.s3 = new S3({
      region: AWS_REGION,
      credentials: {
        accessKeyId: credentials[0],
        secretAccessKey: credentials[1],
      },
    });
  }

  async uploadProjectMedium(
    projectId: string,
    dataBuffer: Buffer
  ): Promise<string> {
    const key = 'projects/' + encodeURIComponent(projectId) + '/' + uuid();
    return this.putFile(dataBuffer, key);
  }

  async uploadBlogMedium(dataBuffer: Buffer): Promise<string> {
    const key = 'blogs/' + uuid();
    return this.putFile(dataBuffer, key);
  }

  async uploadProjectPitchDeck(
    projectId: string,
    dataBuffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const key =
      'projects/' + encodeURIComponent(projectId) + '/pitch-deck/' + uuid();
    return this.putFile(dataBuffer, key, false, mimeType);
  }

  async uploadUserAvatar(dataBuffer: Buffer, userId: string): Promise<string> {
    const key = 'user-avatars' + '/' + userId;
    return this.putFile(dataBuffer, key);
  }

  async uploadUserKyc(
    buffer: Buffer,
    kycImgType: string,
    userId: string
  ): Promise<string> {
    const key = 'kyc/' + userId + '/' + kycImgType;
    return this.putFile(buffer, key, true);
  }

  private async putFile(
    dataBuffer: Buffer,
    key: string,
    isPrivate = false,
    mimeType = 'image/jpeg'
  ): Promise<string> {
    const bucketName = isPrivate ? PRIVATE_BUCKET_NAME : PUBLIC_BUCKET_NAME;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: dataBuffer,
        ContentType: mimeType,
      })
    );
    return `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  }
}
