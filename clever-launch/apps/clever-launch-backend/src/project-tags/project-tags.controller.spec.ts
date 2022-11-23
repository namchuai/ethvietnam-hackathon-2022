import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTagsController } from './project-tags.controller';

describe('ProjectTagsController', () => {
  let controller: ProjectTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectTagsController],
    }).compile();

    controller = module.get<ProjectTagsController>(ProjectTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
