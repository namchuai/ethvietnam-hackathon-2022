import { Test, TestingModule } from '@nestjs/testing';
import { UserBackersController } from './user-backers.controller';

describe('UserBackersController', () => {
  let controller: UserBackersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBackersController],
    }).compile();

    controller = module.get<UserBackersController>(UserBackersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
