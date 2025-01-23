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

@Injectable()
export class RegistryService {

    protected prisma: PrismaService;
    protected codeAnalyzer: AbstractCodeAnalyzerService;

    constructor(private prismaService: PrismaService, private codeAnalyzerService: AbstractCodeAnalyzerService) {
        this.prisma = prismaService;
        this.codeAnalyzer = codeAnalyzerService;
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
        let directDependees: DependencyMetadata[] = this.codeAnalyzer.listDirectDependencies(snapshot.content).match(
            ok => {
                if (ok.kind === 'success') {
                    return ok.value;
                }
                else {
                    throw new HttpException('Invalid source code', 400);
                }
            },
            err => {
                throw new HttpException('Failed to analyze code', 500);
            }  
        );
        let dependeeSnapshotsDb = await this.prisma.users.findMany({
            where: {
                name: {
                    in: directDependees.map(dep => dep.owner)
                }
            },
            include: {
                files: {
                    where: {
                        name: {
                            in: directDependees.map(dep => dep.name)
                        }
                    },
                    include: {
                        snapshots: {
                            where: {
                                version: {
                                    in: directDependees.map(dep => parseInt(dep.version))
                                },
                                isPublic: true
                            }
                        }
                    }
                }
            },
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((users) => {
                return users;
            })
            .finally(() => {});
        let dependeeContents = new Map<{owner: string, name: string, version: string}, Snapshot>();
        for (let user of dependeeSnapshotsDb) {
            for (let file of user.files) {
                for (let snapshot of file.snapshots) {
                    dependeeContents.set({owner: user.name, name: file.name, version: snapshot.version.toString()}, {
                        meta: {
                            owner: user.name,
                            file_name: file.name,
                            version: snapshot.version,
                            created_at: snapshot.createdAt.toISOString(),
                            id: getSnapshotId(user.name, file.name, snapshot.version)
                        },
                        content: snapshot.content
                    });
                }
            }
        }
        let projectDependencies = directDependees.map(dep => {
            let snapshot = dependeeContents.get(dep);
            if (!snapshot) {
                throw new HttpException('Dependency not found', 404);
            }
            return {
                id: getSnapshotId(dep.owner, dep.name, parseInt(dep.version)),
                snapshot: snapshot
            };
        })
        return {
            result: ProjectFetchResult.ResultEnum.Ok,
            ok: {
                id: snapshotId,
                dependencies: projectDependencies
            }
        }
    }
}
