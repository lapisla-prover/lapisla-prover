import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';


@Injectable()
export class SearchService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async searchSnapshots(query: string, offset: number = 0, limit: number = 5, before: string | undefined): Promise<SearchResult> {
        throw new Error('Method not implemented.');
    }
}
