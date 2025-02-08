import { RepositoryService } from '../repository.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { AbstractSearchLogicService } from 'src/searchlogic';
import { SearchCandidate } from 'src/searchlogic';
import { getSnapshotInfoFromId } from 'src/utils';

@Injectable()
export class TagsService {

    protected repo: RepositoryService;

    constructor(private repositoryService: RepositoryService) {
        this.repo = repositoryService;
    }

    public async getTags(): Promise<string[]> {
        const tags = (await this.repo.getTags())
            .match(
                (tags) => tags,
                (error) => {
                    throw new HttpException('Internal Error', 500);
                },
            )
        return tags.map(tag => tag.name);
    }
}
