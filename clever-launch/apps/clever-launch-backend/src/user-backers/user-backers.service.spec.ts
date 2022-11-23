import { Test, TestingModule } from '@nestjs/testing';
import { UserBackersService } from './user-backers.service';

describe('UserBackersService', () => {
  let service: UserBackersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBackersService],
    }).compile();

    service = module.get<UserBackersService>(UserBackersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
