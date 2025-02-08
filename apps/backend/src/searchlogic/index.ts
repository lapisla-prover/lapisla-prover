import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RepositoryService } from '../repository.service';


export interface SearchCandidate<ReturnType> {
    owner: string;
    fileName: string;
    version: string;
    source: string;
    returnVal: ReturnType;
}

@Injectable()
export abstract class AbstractSearchLogicService<ReturnType> {
    protected prisma: PrismaClient;

    constructor(repositoryService: RepositoryService) {
        this.prisma = repositoryService.__doNotUseThisMethodGetPrismaClient();
    }

    abstract search(
        query: string,
        offset: number,
        limit: number,
        searchCandidate: SearchCandidate<ReturnType>[]
    ): Promise<ReturnType[]>;
}

@Injectable()
export class MockSearchLogicService extends AbstractSearchLogicService<string> {
    constructor(repositoryService: RepositoryService) {
        super(repositoryService);
    }

    async search(
        query: string,
        offset: number,
        limit: number,
        searchCandidate: SearchCandidate<string>[]
    ): Promise<string[]> {
        return searchCandidate
            .filter(candidate => candidate.source.includes(query))
            .slice(offset, offset + limit)
            .map(candidate => candidate.returnVal);
    }
}