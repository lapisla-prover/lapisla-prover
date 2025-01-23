import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { PrivateFileMeta } from '../generated/openapi/model/privateFileMeta';
import { SnapshotMeta } from '../generated/openapi/model/snapshotMeta';
import { AbstractAuthService } from '../auth.service';

@Injectable()
export class MeService<TokenType> {

    private prisma: PrismaService;
    private auth: AbstractAuthService<TokenType>;

    constructor(private prismaService: PrismaService, private authService: AbstractAuthService<TokenType>) {
        this.prisma = prismaService;
        this.auth = authService;
    }

    public async deleteMyFile(fileName: string, ): Promise<null> {
        throw new Error('Method not implemented.');
    }
    
    public async getMyFile(fileName: string, ): Promise<PrivateFileMeta> {
        throw new Error('Method not implemented.');
    }

    public async uploadMySnapshot(fileName: string, body?: string, ): Promise<SnapshotMeta> {
        throw new Error('Method not implemented.');
    }

    public async createMyFile(fileName: string, ): Promise<PrivateFileMeta> {
        throw new Error('Method not implemented.');
    }

    public async createMyPermalink(fileName: string, version: number, ): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async registerMySnapshot(fileName: string, version: number, ): Promise<null> {
        throw new Error('Method not implemented.');
    }

    public async getMyFiles(): Promise<PrivateFileMeta[]> {
        throw new Error('Method not implemented.');
    }
}
