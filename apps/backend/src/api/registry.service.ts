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
        if (!snapshot.isPublic) {
            throw new HttpException('Snapshot not found', 404);
        }
        const dependenciesDb = await this.prisma.dependencies.findMany({
            where: {
                dependerId: snapshot.id
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((dependencies) => {
                return dependencies;
            })
            .finally(() => {});
        const dependencySnapshots = await this.prisma.users.findMany({
            include: {
                files: {
                    include: {
                        snapshots: {
                            where: {
                                id: {
                                    in: dependenciesDb.map((dependency) => {
                                        return dependency.dependeeId;
                                    })
                                }
                            }
                        }
                    }
                }
            },
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((snapshots) => {
                return snapshots;
            })
            .finally(() => {});
        let dependencies: Dependency[] = [];
        for (let userFileSnap of dependencySnapshots) {
            for (let fileSnap of userFileSnap.files) {
                for (let snap of fileSnap.snapshots) {
                    dependencies.push({
                        id: getSnapshotId(userFileSnap.name, fileSnap.name, snap.version),
                        snapshot: {
                            meta: {
                                id: getSnapshotId(userFileSnap.name, fileSnap.name, snap.version),
                                owner: userFileSnap.name,
                                fileName: fileSnap.name,
                                version: snap.version,
                                createdAt: snap.createdAt.toISOString(),
                            },
                            content: snap.content
                        }
                    })
                }
            }
        }
        console.log(snapshotInfo);
        console.log(dependencies);
        console.log(dependenciesDb);
        if (dependencies.length !== dependenciesDb.length) {
            return {
                result: ProjectFetchResult.ResultEnum.Error,
                error: 'Deleted dependency snapshot'
            }
        }
        return {
            result: ProjectFetchResult.ResultEnum.Ok,
            ok: {
                id: snapshotId,
                dependencies: dependencies
            }
        }
    }
}
