import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { Snapshot } from '../generated/openapi/model/snapshot';


@Injectable()
export class PermalinksService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async getPermalink(permalinkId: string, ): Promise<Snapshot> {
        throw new Error('Method not implemented.');
    }
}
