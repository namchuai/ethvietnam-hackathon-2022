import { Injectable } from '@nestjs/common';
import { Backer } from '@clever-launch/data';
import { BackersRepository } from './backers.repository';

@Injectable()
export class BackersService {
  constructor(private readonly backersRepository: BackersRepository) {}
  
  async getBackers(): Promise<Backer[]> {
    return this.backersRepository.getBackers();
  }
}
