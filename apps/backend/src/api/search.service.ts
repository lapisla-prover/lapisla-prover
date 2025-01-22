import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { SearchSnapshotsQueryParameter } from '../generated/openapi/model/searchSnapshotsQueryParameter';
import { SearchResult } from '../generated/openapi/model/searchResult';


@Injectable()
export class SearchService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async searchSnapshots(query: SearchSnapshotsQueryParameter, ): Promise<SearchResult> {
        throw new Error('Method not implemented.');
    }
}
