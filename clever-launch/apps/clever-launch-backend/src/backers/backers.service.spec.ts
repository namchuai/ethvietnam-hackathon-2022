import { Test, TestingModule } from '@nestjs/testing';
import { BackersService } from './backers.service';

describe('BackersService', () => {
  let service: BackersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackersService],
    }).compile();

    service = module.get<BackersService>(BackersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
