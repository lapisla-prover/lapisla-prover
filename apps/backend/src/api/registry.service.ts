import { PrismaService } from '../prisma.service';

import { DependencyMetadata } from 'src/kernel';

import { getSnapshotInfoFromId } from 'src/utils';
import { Injectable, Optional } from '@nestjs/common';
import { Project } from '../generated/openapi/model/project';
import { AbstractCodeAnalyzerService } from '../kernel/index';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class RegistryService {

    protected prisma: PrismaService;
    protected codeAnalyzer: AbstractCodeAnalyzerService;

    constructor(private prismaService: PrismaService, private codeAnalyzerService: AbstractCodeAnalyzerService) {
        this.prisma = prismaService;
        this.codeAnalyzer = codeAnalyzerService;
    }

    public async getProjectDependencies(snapshotId: string, ): Promise<Project> {
        let snapshotInfo: {owner: string, fileName: string, version: number};
        try {
            snapshotInfo = getSnapshotInfoFromId(snapshotId);
        }
        catch (e) {
            throw new HttpException('Invalid snapshot id', 400);
        }
        const userId = await this.prisma.users.findUnique
        ({
            where: {
                name: snapshotInfo.owner
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((user) => {
                if (!user) {
                    throw new HttpException('User not found', 404);
                }
                return user.id;
            })
            .finally(() => {});
        const file = await this.prisma.files.findUnique
        ({
            where: {
                owner_id_name: {
                    owner_id: userId,
                    name: snapshotInfo.fileName
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((file) => {
                if (!file) {
                    throw new HttpException('File not found', 404);
                }
                return file;
            })
            .finally(() => {});
        const snapshot = await this.prisma.snapshots.findUnique
        ({
            where: {
                file_id_version: {
                    file_id: file.id,
                    version: snapshotInfo.version
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((snapshot) => {
                if (!snapshot) {
                    throw new HttpException('Snapshot not found', 404);
                }
                return snapshot;
            })
            .finally(() => {});
        let directDependees: DependencyMetadata[];
        try {
            directDependees = this.codeAnalyzer.listDirectDependencies(snapshot.content);
        }
        catch (e) {
            throw new HttpException('Failed to analyze code', 500);
        }
        const ownersAndIdsList = await this.prisma.users.findMany({
            where: {
                name: {
                    in: directDependees.map(dep => dep.owner)
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((users) => {
                return users.map(user => ({owner: user.name, id: user.id}));
            })
            .finally(() => {});
        
        throw new Error('Method not implemented.');
    }
}
