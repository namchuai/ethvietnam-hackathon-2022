import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CLPrivilege,
  EkycRequest,
  EkycStatus,
  Profile,
  User,
} from '@clever-launch/data';
import { ChainService } from '../chain/chain.service';
import { StorageService } from '../storage/storage.service';
import { UsersRepository } from './users.repository';
import { SubmitEkycInputDto } from './dtos/submit-ekyc-input.dto';
import { UserNotRegisteredException } from './exceptions/user-not-registered.exception';
import { UserEkycAlreadySuccessException } from './exceptions/user-ekyc-already-success.exception';
import { UserEkycAlreadyInReviewException } from './exceptions/user-ekyc-already-in-review.exception';
import { UpdateProfileInput } from './dtos/update-profile-input.dto';
import { getUtcTimestamp } from '../utils/date-time';
import { ProfileNotFoundException } from './exceptions/profile-not-found.exception';
import { PrivilegesService } from '../privileges/privileges.service';
import { UserDoNotHavePermissionException } from '../privileges/exceptions/user-do-not-have-permission.exception';
import { UserEkycNotInReviewException } from './exceptions/user-ekyc-not-in-review.exception';
import { EkycRequestNotFound } from './exceptions/ekyc-request-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly chainService: ChainService,
    private readonly usersRepository: UsersRepository,
    private readonly storageService: StorageService,
    private readonly privilegesService: PrivilegesService
  ) {}

  async getUserOrThrow(id: string): Promise<User> {
    const ethKey = this.chainService.normalizeUserInputEthAddress(id);
    const user = await this.getUser(ethKey);
    if (!user) {
      throw new UserNotRegisteredException();
    }
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const ethKey = this.chainService.normalizeUserInputEthAddress(id);
    return this.usersRepository.getUser(ethKey);
  }

  async createUser(ethKey: string, nonce: number): Promise<void> {
    const user: User = {
      id: ethKey,
      eKycStatus: EkycStatus.NotStarted,
      authNonce: nonce,
    };
    return this.usersRepository.createUser(user);
  }

  async updateUserAuthNonce(ethKey: string, nonce: number): Promise<void> {
    return this.usersRepository.updateAuthNonce(ethKey, nonce);
  }

  async uploadAvatar(buffer: Buffer, userId: string): Promise<string> {
    const url = await this.storageService.uploadUserAvatar(buffer, userId);
    await this.usersRepository.updateAvatarUrl(userId, url);
    return url;
  }

  async resetAuthNonce(ethKey: string): Promise<void> {
    return this.usersRepository.updateAuthNonce(ethKey, -1);
  }

  async uploadUserKycFront(buffer: Buffer, userId: string): Promise<string> {
    return this.storageService.uploadUserKyc(buffer, 'front', userId);
  }

  async uploadUserKycBack(buffer: Buffer, userId: string): Promise<string> {
    return this.storageService.uploadUserKyc(buffer, 'back', userId);
  }

  async uploadUserKycSelfie(buffer: Buffer, userId: string): Promise<string> {
    return this.storageService.uploadUserKyc(buffer, 'selfie', userId);
  }

  async submitEkyc(userId: string, body: SubmitEkycInputDto): Promise<void> {
    const {
      selfie,
      firstName,
      lastName,
      dateOfBirth,
      countryOfResidence,
      frontUrl,
      backUrl,
    } = body;
    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new UserNotRegisteredException();
    }
    if (user.eKycStatus === EkycStatus.Successful) {
      throw new UserEkycAlreadySuccessException();
    }
    if (user.eKycStatus === EkycStatus.InReview) {
      throw new UserEkycAlreadyInReviewException();
    }
    const timestamp = getUtcTimestamp();

    const ekycRequest: EkycRequest = {
      userId,
      firstName,
      lastName,
      dateOfBirth,
      countryOfResidence,
      frontUrl,
      backUrl,
      selfie,
      createdAt: timestamp,
    };

    try {
      return this.usersRepository.submitEkyc(ekycRequest);
    } catch (err) {
      throw new BadRequestException(
        'User ekyc already successfully or in-review state'
      );
    }
  }

  async updateProfile(
    userId: string,
    body: UpdateProfileInput
  ): Promise<Profile> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    if (!normalizedUserId) {
      throw new UserNotRegisteredException();
    }

    const {
      name,
      email,
      city,
      country,
      biography,
      avatarUrl,
      urlProfilePage,
      website,
    } = body;
    const timestamp = getUtcTimestamp();
    const currentProfile = await this.getProfile(userId);
    const profile: Profile = {
      id: normalizedUserId,
      name: name ?? currentProfile?.name,
      email: email ?? currentProfile?.email,
      city: city ?? currentProfile?.city,
      avatarUrl: avatarUrl ?? currentProfile?.avatarUrl,
      country: country ?? currentProfile?.country,
      biography: biography ?? currentProfile?.biography,
      urlProfilePage: urlProfilePage ?? currentProfile?.urlProfilePage,
      website: website ?? currentProfile?.website,
      createdAt: currentProfile?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    await this.usersRepository.updateProfile(profile);
    return this.getProfileOrThrow(normalizedUserId);
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    return this.usersRepository.getProfile(normalizedUserId);
  }

  async getProfileOrThrow(userId: string): Promise<Profile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return profile;
  }

  async approveEkyc(userId: string, ekycRequestUserId: string): Promise<void> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);

    const havePermission = await this.privilegesService.isUserHavePermissionFor(
      normalizedUserId,
      CLPrivilege.ApproveEkyc
    );

    if (!havePermission) {
      throw new UserDoNotHavePermissionException();
    }

    const user = await this.getUserOrThrow(normalizedUserId);
    if (user.eKycStatus !== EkycStatus.InReview) {
      throw new UserEkycNotInReviewException();
    }

    const ekycRequest = await this.getEkycRequestOrThrow(normalizedUserId);

    const normalizedEkycRequestUserId =
      this.chainService.normalizeUserInputEthAddress(ekycRequestUserId);
    await this.usersRepository.approveEkycRequest(
      normalizedEkycRequestUserId,
      ekycRequest
    );
  }

  async rejectEkyc(
    userId: string,
    ekycRequestUserId: string,
    reason: string
  ): Promise<void> {
    const normalizedUserId =
      this.chainService.normalizeUserInputEthAddress(userId);
    const havePermission = await this.privilegesService.isUserHavePermissionFor(
      normalizedUserId,
      CLPrivilege.ApproveEkyc
    );

    if (!havePermission) {
      throw new UserDoNotHavePermissionException();
    }

    const user = await this.getUserOrThrow(normalizedUserId);
    if (user.eKycStatus !== EkycStatus.InReview) {
      throw new UserEkycNotInReviewException();
    }

    const normalizedEkycRequestUserId =
      this.chainService.normalizeUserInputEthAddress(ekycRequestUserId);

    await this.usersRepository.rejectEkycRequest(
      normalizedEkycRequestUserId,
      reason
    );
  }

  private async getEkycRequest(
    userId: string
  ): Promise<EkycRequest | undefined> {
    return this.usersRepository.getEkycRequest(userId);
  }

  private async getEkycRequestOrThrow(userId: string): Promise<EkycRequest> {
    const request = await this.getEkycRequest(userId);
    if (!request) {
      throw new EkycRequestNotFound();
    }
    return request;
  }
}
