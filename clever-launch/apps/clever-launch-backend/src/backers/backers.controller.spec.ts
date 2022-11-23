import { Test, TestingModule } from '@nestjs/testing';
import { BackersController } from './backers.controller';

describe('BackersController', () => {
  let controller: BackersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackersController],
    }).compile();

    controller = module.get<BackersController>(BackersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
