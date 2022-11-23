import { Injectable } from '@nestjs/common';
import { AdvisorsRepository } from './advisors.repository';
import { Advisor } from '@clever-launch/data';

@Injectable()
export class AdvisorsService {
  constructor(private readonly advisorsRepository: AdvisorsRepository) {}

  async getAllAdvisors(): Promise<Advisor[]> {
    return this.advisorsRepository.getAllAdvisors();
  }
}
