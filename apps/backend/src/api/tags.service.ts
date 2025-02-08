import { RepositoryService } from '../repository.service';

import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  protected repo: RepositoryService;

  constructor(private repositoryService: RepositoryService) {
    this.repo = repositoryService;
  }

  public async getTags(): Promise<string[]> {
    const tags = (await this.repo.getTags()).match(
      (tags) => tags,
      (error) => {
        throw new HttpException('Internal Error', 500);
      },
    );
    return tags.map((tag) => tag.name);
  }
}
