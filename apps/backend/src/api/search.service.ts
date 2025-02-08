import { PrismaClient } from '@prisma/client';
import { RepositoryService } from '@/repository.service';

import { Injectable } from '@nestjs/common';
import { SearchResult } from '@/generated/openapi/model/models';
import { AbstractSearchLogicService, SearchCandidate } from 'src/searchlogic';

// ReturnType is the snapshots.id in db
@Injectable()
export class SearchService {
  protected prisma: PrismaClient;
  protected searchLogic: AbstractSearchLogicService<string>;
  protected searchCandidatesCache: SearchCandidate<string>[] = [];
  protected cacheTimestamp: number = Date.now();
  protected cacheTimeoutSeconds: number = 60;

  constructor(
    private repositoryService: RepositoryService,
    protected searchLogicService: AbstractSearchLogicService<string>,
  ) {
    this.prisma = repositoryService.__doNotUseThisMethodGetPrismaClient();
    this.searchLogic = searchLogicService;
  }

  public async searchSnapshots(
    query: string,
    offset: number = 0,
    limit: number = 5,
    before: string | undefined,
  ): Promise<SearchResult> {
    // Unimplemented: Tag, User, File search
    return {
      before: before,
      offset: offset,
      results: [],
    };
  }
}
