import { PrismaService } from '../prisma.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { PrivateFileMeta } from '../generated/openapi/model/privateFileMeta';
import { SnapshotMeta } from '../generated/openapi/model/snapshotMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { AbstractAuthService } from '../auth.service';
import { SourceCodeWrapper } from '../generated/openapi/model/sourceCodeWrapper';
import { getSnapshotId } from 'src/utils';
import { get } from 'http';

@Injectable()
export class MeService {

    private prisma: PrismaService;
    private auth: AbstractAuthService;

    constructor(private prismaService: PrismaService, private authService: AbstractAuthService) {
        this.prisma = prismaService;
        this.auth = authService;
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

    public async uploadMySnapshot(fileName: string, body: SourceCodeWrapper, auth: string): Promise<SnapshotMeta> {
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
        this.prisma.snapshots.create({
            data: {
                fileId: file.id,
                version: snapshots.length,
                content: body.content,
                isPublic: false
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        const thisSnapshot = await this.prisma.snapshots.findUnique({
            where: {
                fileId_version: {
                    fileId: file.id,
                    version: snapshots.length
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
            id: thisSnapshot.id,
            owner: userName,
            fileName: fileName,
            version: thisSnapshot.version,
            registered: thisSnapshot.isPublic,
            createdAt: thisSnapshot.createdAt.toISOString()
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
            updatedAt: file.createdAt.toISOString()
        };
    }

    public async registerMySnapshot(fileName: string, versionStr: string, auth: string): Promise<null> {
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
            });
        this.prisma.snapshots.update({
            where: {
                id: snapshot.id
            },
            data: {
                isPublic: true
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .finally(() => {});
        return null;
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
}
