import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTagsService } from './project-tags.service';

describe('ProjectTagsService', () => {
  let service: ProjectTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectTagsService],
    }).compile();

    service = module.get<ProjectTagsService>(ProjectTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
