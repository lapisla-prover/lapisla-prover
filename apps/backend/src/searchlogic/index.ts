import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'


export interface SearchCandidate<ReturnType> {
    owner: string;
    fileName: string;
    version: string;
    source: string;
    returnVal: ReturnType;
}

@Injectable()
export abstract class AbstractSearchLogicService<ReturnType> {
    protected prisma: PrismaService;

    constructor(prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    abstract search(
        query: string,
        offset: number,
        limit: number,
        searchCandidate: SearchCandidate<ReturnType>[]
    ): Promise<ReturnType[]>;
}
