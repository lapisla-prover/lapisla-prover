import { PrismaService } from '../prisma.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { PrivateFileMeta } from '../generated/openapi/model/privateFileMeta';
import { SnapshotMeta } from '../generated/openapi/model/snapshotMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { AbstractAuthService } from '../auth.service';
import { SourceCodeWrapper } from '../generated/openapi/model/sourceCodeWrapper';
import { getSnapshotId, getSnapshotInfoFromId } from 'src/utils';
import { get } from 'http';
import { AbstractCodeAnalyzerService } from '../kernel/index';
import { parse } from 'path';
import { ValidationFailed } from '../kernel/index';
import { SnapshotRegisterResponse } from '../generated/openapi/model/snapshotRegisterResponse';
import { SnapshotSaveResponse } from '../generated/openapi/model/snapshotSaveResponse';
import { Registration } from '../generated/openapi/model/registration';
import { UserInfo } from '../generated/openapi/model/userInfo';
import { isValidTag } from '../utils';

@Injectable()
export class MeService {

    private prisma: PrismaService;
    private auth: AbstractAuthService;
    private analyzer: AbstractCodeAnalyzerService;

    constructor(private prismaService: PrismaService, private authService: AbstractAuthService, private codeAnalyzerService: AbstractCodeAnalyzerService) {
        this.prisma = prismaService;
        this.auth = authService;
        this.analyzer = codeAnalyzerService;
    }

    public async deleteMyFile(fileName: string, auth: string): Promise<null> {
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
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
        await this.prisma.files.delete({
            where: {
                id: file.id
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        return null;
    }
    
    public async getMyFile(fileName: string, auth: string): Promise<PrivateFileMeta> {
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
                }
            },
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
        const snapshots = await this.prisma.snapshots.findMany({
            where: {
                fileId: file.id
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        return {
            owner: userName,
            fileName: fileName,
            versions: snapshots.map(snapshot => snapshot.version),
            registeredVersions: snapshots.filter(snapshot => snapshot.isPublic).map(snapshot => snapshot.version),
            createdAt: file.createdAt.toISOString(),
            updatedAt: snapshots.reduce((acc, snapshot) => {
                return snapshot.createdAt > acc ? snapshot.createdAt : acc;
            }, file.createdAt).toISOString()
        }

    }

    public async uploadMySnapshot(fileName: string, body: SourceCodeWrapper, auth: string): Promise<SnapshotSaveResponse> {
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
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
        const snapshots = await this.prisma.snapshots.findMany({
            where: {
                fileId: file.id
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        // saving exactly the same snapshot is not allowed
        if (snapshots.length > 0 && snapshots[snapshots.length - 1].content === body.content) {
            return {
                result: 'already_saved',
                snapshot: {
                    id: getSnapshotId(userName, fileName, snapshots.length - 1),
                    owner: userName,
                    fileName: fileName,
                    version: snapshots.length - 1,
                    registered: snapshots[snapshots.length - 1].isPublic,
                    createdAt: snapshots[snapshots.length - 1].createdAt.toISOString()
                }
            }
        }
        const thisSnapshot = await this.prisma.snapshots.create({
            data: {
                fileId: file.id,
                version: snapshots.length,
                content: body.content,
                isPublic: false,
                snapshotId: getSnapshotId(userName, fileName, snapshots.length)
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        return {
            result: 'newly_saved',
            snapshot: {
                id: getSnapshotId(userName, fileName, snapshots.length),
                owner: userName,
                fileName: fileName,
                version: thisSnapshot.version,
                registered: false,
                createdAt: thisSnapshot.createdAt.toISOString()
            }
        };
    }

    public async getMySnapshot(fileName: string, versionStr: string, auth: string): Promise<Snapshot> {
        let version: number;
        try {
            version = parseInt(versionStr);
        } catch (err) {
            throw new HttpException('Invalid version', 400);
        }
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
            const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
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
        const snapshot = await this.prisma.snapshots.findUnique({
            where: {
                fileId_version: {
                    fileId: file.id,
                    version: version
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
        return {
            meta: {
                id: getSnapshotId(userName, fileName, version),
                owner: userName,
                fileName: fileName,
                version: snapshot.version,
                registered: snapshot.isPublic,
                createdAt: snapshot.createdAt.toISOString()
            },
            content: snapshot.content
        };
    }

    public async createMyFile(fileName: string, auth: string): Promise<PrivateFileMeta> {
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const isValidFileName = /^[a-zA-Z0-9-]+$/.test(fileName);
        if (!isValidFileName) {
            throw new HttpException('Invalid file name', 400);
        }
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        // Check if the file already exists
        await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((file) => {
                if (file) {
                    throw new HttpException('File already exists', 409);
                }
            });
        const file = await this.prisma.files.create({
            data: {
                ownerId: userId,
                name: fileName
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        await this.prisma.snapshots.create({
            data: {
                fileId: file.id,
                version: 0,
                content: '# Welcome to Lapisla! Write your proof here.\n',
                isPublic: false,
                snapshotId: getSnapshotId(userName, fileName, 0)
            }
        })
        return {
            owner: userName,
            fileName: fileName,
            versions: [0],
            registeredVersions: [],
            createdAt: file.createdAt.toISOString(),
            updatedAt: file.createdAt.toISOString()
        };
    }

    public async registerMySnapshot(fileName: string, versionStr: string, auth: string): Promise<SnapshotRegisterResponse> {
        let version: number;
        try {
            version = parseInt(versionStr);
        } catch (err) {
            throw new HttpException('Invalid version', 400);
        }
        // Get username
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
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
        const snapshot = await this.prisma.snapshots.findUnique({
            where: {
                fileId_version: {
                    fileId: file.id,
                    version: version
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
            });
        if (snapshot.isPublic) {
            return {
                result: 'already_registered'
            }
        }
        const dependencies = this.analyzer.listDirectDependencies(snapshot.content)
            .match(
                (deps) => {
                    if (deps.kind === 'invalid_source') {
                        throw new HttpException('Invalid source code', 400);
                    }
                    return deps.value;
                },
                () => { throw new HttpException('Internal Error', 500); }
            );
        const depsSnapId = dependencies.map(dep => getSnapshotId(dep.owner, dep.name, parseInt(dep.version)));
        const depsSnaps = await this.prisma.snapshots.findMany({
            where: {
                snapshotId: {
                    in: depsSnapId
                },
                isPublic: true
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        if (depsSnaps.length !== depsSnapId.length) {
            throw new HttpException('Dependency not found', 404);
        }
        const depsSnapsWithMe = depsSnaps.concat(snapshot);
        // Validate
        const validationResult = this.analyzer.validate(snapshot.content, depsSnapsWithMe.map(depSnap => {
            const info = getSnapshotInfoFromId(depSnap.snapshotId).match(
                info => info,
                () => { throw new HttpException('Internal Error', 500); }
            );
            return {
                metadata: {
                    owner: info.owner,
                    name: info.fileName,
                    version: info.version.toString()
                },
                source: depSnap.content
            }
        }));
        if (validationResult.kind === 'source_error') {
            return {
                result: 'invalid'
            }
        }
        else if (validationResult.kind === 'kernel_error') {
            throw new HttpException('Internal Error', 500);
        }
        await this.prisma.snapshots.update({
            where: {
                id: snapshot.id
            },
            data: {
                isPublic: true,
                registeredAt: new Date()
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        await this.prisma.dependencies.createMany({
            data: depsSnapsWithMe.map(depSnap => {
                return {
                    dependerId: snapshot.id,
                    dependeeId: depSnap.id
                }
            })
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        return {
            result: 'registered'
        };
    }

    public async getMyFiles(auth: string): Promise<PrivateFileMeta[]> {
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const files = await this.prisma.files.findMany({
            where: {
                ownerId: userId
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        const filesAndSnapshots = await this.prisma.files.findMany({
            where: {
                ownerId: userId
            },
            include: {
                snapshots: true
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        let fileIdToFilesAndSnapshots: Map<string, { snapshots: { version: number; isPublic: boolean; createdAt: Date }[] }> = new Map();
        filesAndSnapshots.forEach(file => {
            fileIdToFilesAndSnapshots[file.id] = file;
        });
        let fileMetas: PrivateFileMeta[] = files.map(file => {
            return {
                owner: userName,
                fileName: file.name,
                versions: fileIdToFilesAndSnapshots[file.id].snapshots.map(snapshot => snapshot.version),
                registeredVersions: fileIdToFilesAndSnapshots[file.id].snapshots.filter(snapshot => snapshot.isPublic).map(snapshot => snapshot.version),
                createdAt: file.createdAt.toISOString(),
                updatedAt: fileIdToFilesAndSnapshots[file.id].snapshots.reduce((acc, snapshot) => {
                    return snapshot.createdAt > acc ? snapshot.createdAt : acc;
                }, file.createdAt).toISOString()
            }
        });
        return fileMetas;
    }

    public async updateTagsAndDescription(fileName: string, version: string, body: Registration, auth: string): Promise<SnapshotMeta> {
        let versionNumber: number;
        try {
            versionNumber = parseInt(version);
        } catch (err) {
            throw new HttpException('Invalid version', 400);
        }
        for (let tag of body.tags) {
            if (!isValidTag(tag)) {
                throw new HttpException('Invalid tag', 400);
            }
        }
        const userName = (
            await this.auth.authenticate(auth)
        )
            .match(
                user => user,
                () => { throw new HttpException('Unauthorized', 401); }
            );
        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
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
        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
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
        const snapshot = await this.prisma.snapshots.findUnique({
            where: {
                fileId_version: {
                    fileId: file.id,
                    version: versionNumber
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
        await this.prisma.tags.createMany({
            data: body.tags.map(tag => {
                return {
                    name: tag
                }
            }),
            skipDuplicates: true
        })
            .catch((err) => {
                console.log(err);
                throw new HttpException('Internal Error', 500);
            });
        const tags = await this.prisma.tags.findMany({
            where: {
                name: {
                    in: body.tags
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        await this.prisma.snapshots.update({
            where: {
                id: snapshot.id
            },
            data: {
                description: body.description,
                tags: {
                    deleteMany: {},
                    create: tags.map(tag => {
                        return {
                            tagId: tag.id
                        }
                    })
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        return {
            id: snapshot.snapshotId,
            owner: userName,
            fileName: fileName,
            version: versionNumber,
            registered: snapshot.isPublic,
            createdAt: snapshot.createdAt.toISOString()
        }
    }

    async getMyUser(auth: string): Promise<UserInfo> {
        const userName = (
            await this.auth.authenticate(auth)
        ).match(
                user => user,
                (_) => { throw new HttpException('Unauthorized', 401); }
        );
        const user = await this.prisma.users.findUnique({
            where: {
                name: userName
            }
        }).catch((err) => {
            throw new HttpException('Internal Error', 500);
        }).then((user) => {
            if (!user) {
                throw new HttpException('User not found', 404);
            }
            return user;
        });

        return {
            username: user.name,
            github_id: user.githubId,
        };
    }
}
