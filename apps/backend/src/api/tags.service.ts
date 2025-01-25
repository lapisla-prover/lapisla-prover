import { PrismaService } from '../prisma.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { AbstractSearchLogicService } from 'src/searchlogic';
import { SearchCandidate } from 'src/searchlogic';
import { getSnapshotInfoFromId } from 'src/utils';

@Injectable()
export class TagsService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async getTags(): Promise<string[]> {
        const tags = await this.prisma.tags.findMany({
            select: {
                name: true
            }
        });
        return tags.map(tag => tag.name);
    }
}
