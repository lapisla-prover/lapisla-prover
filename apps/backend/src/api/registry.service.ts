import { PrismaService } from '../prisma.service';

import { DependencyMetadata } from 'src/kernel';

import { getSnapshotInfoFromId, getSnapshotId } from 'src/utils';
import { Injectable, Optional } from '@nestjs/common';
import { Project } from '../generated/openapi/model/project';
import { AbstractCodeAnalyzerService } from '../kernel/index';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ProjectFetchResult } from 'src/generated/openapi';
import { SnapshotMeta } from '../generated/openapi/model/snapshotMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { Dependency } from '../generated/openapi/model/dependency';

@Injectable()
export class RegistryService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async getProjectDependencies(snapshotId: string, ): Promise<ProjectFetchResult> {
        let snapshotInfoResult = getSnapshotInfoFromId(snapshotId);
        if (!snapshotInfoResult.isOk()) {
            throw new HttpException('Invalid snapshot id', 400);
        }
        const snapshotInfo = snapshotInfoResult.value;
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
                ownerId_name: {
                    ownerId: userId,
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
                fileId_version: {
                    fileId: file.id,
                    version: snapshotInfo.version
                },
                isPublic: true
            },
            include: {
                dependees: true
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
        const dependenciesSnaps = await this.prisma.snapshots.findMany({
            where: {
                id: {
                    in: snapshot.dependees.map((dep) => dep.dependeeId),
                },
                isPublic: true
            },
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((dependencies) => {
                return dependencies;
            })
            .finally(() => {});
        if (dependenciesSnaps.length !== snapshot.dependees.length) {
            return {
                result: ProjectFetchResult.ResultEnum.Error,
                error: 'Deleted dependencies',
            }
        }
        const dependencies: Dependency[] = dependenciesSnaps.map((depSnap) => {
            const snapInfo = getSnapshotInfoFromId(depSnap.snapshotId).match(
                (info) => info,
                () => {
                    throw new Error('Invalid snapshot id');
                }
            );
            return {
                snapshot: {
                    meta: {
                        id: depSnap.snapshotId,
                        owner: snapInfo.owner,
                        fileName: snapInfo.fileName,
                        version: snapInfo.version,
                        registered: depSnap.isPublic,
                        createdAt: depSnap.createdAt.toISOString(),
                    },
                    content: depSnap.content,
                },
                id: snapshot.snapshotId,
            }
        })
        const project: Project = {
            id: snapshot.snapshotId,
            dependencies: dependencies,
        }
        return {
            result: ProjectFetchResult.ResultEnum.Ok,
            ok: project,
        }
    }
}
