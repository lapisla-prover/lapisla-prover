import { PrismaService } from '../prisma.service';
import { getSnapshotId } from 'src/utils';

import { Injectable, Optional, HttpException } from '@nestjs/common';
import { PublicFileMeta } from '../generated/openapi/model/publicFileMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';
import { SnapshotMeta } from 'src/generated/openapi';

@Injectable()
export class FilesService {

    protected prisma: PrismaService;

    constructor (private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async getPublicFile(userName: string, fileName: string, ): Promise<PublicFileMeta> {
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
        const public_snapshots = await this.prisma.snapshots.findMany({
            where: {
                fileId: file.id,
                isPublic: true
            }
        })
            .catch((err) => {
                throw new Error('Todo: Internal Error');
            })
            .then((snapshots) => {
                return snapshots;
            })
            .finally(() => {});
        const fileMeta: PublicFileMeta = {
            owner: userName,
            file_name: fileName,
            registered_versions: public_snapshots.map((snapshot) => snapshot.version).sort((a, b) => a - b),
            created_at: file.createdAt.toISOString(),
            updated_at: public_snapshots.reduce((acc, snapshot) => {
                return snapshot.createdAt > acc ? snapshot.createdAt : acc;
            }, file.createdAt).toISOString()
        };
        return fileMeta;
    }
    
    public async getPublicSnapshot(userName: string, fileName: string, version: string, ): Promise<Snapshot> {
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
                    version: parseInt(version)
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
        const snapshotMeta: SnapshotMeta = {
            id: getSnapshotId(userName, fileName, parseInt(version)),
            owner: userName,
            file_name: fileName,
            version: parseInt(version),
            registered: snapshot.isPublic,
            created_at: snapshot.createdAt.toISOString()
        };
        return {
            meta: snapshotMeta,
            content: snapshot.content
        }
    }

    public async getPublicFiles(userName: string, ): Promise<PublicFileMeta[]> {
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
            .then((files) => {
                return files;
            })
            .finally(() => {});
        const publicSnapshots = await this.prisma.snapshots.findMany({
            where: {
                fileId: {
                    in: files.map((file) => file.id)
                },
                isPublic: true
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            })
            .then((snapshots) => {
                return snapshots;
            })
            .finally(() => {});
        let fileIdToFileName = new Map<string, string>();
        files.forEach((file) => {
            fileIdToFileName.set(file.id, file.name);
        });
        let fileNameToSnapshots = new Map<string, {file_id: string, version: number, created_at: Date}[]>();
        files.forEach((file) => {
            fileNameToSnapshots.set(file.name, []);
        });
        publicSnapshots.forEach((snapshot) => {
            const fileName = fileIdToFileName.get(snapshot.fileId);
            if (!fileNameToSnapshots.has(fileName)) {
                fileNameToSnapshots.set(fileName, []);
            }
            fileNameToSnapshots.get(fileName).push({
                file_id: snapshot.fileId,
                version: snapshot.version,
                created_at: snapshot.createdAt
            });
        });
        const publicFileMeta: PublicFileMeta[] = files.map((file) => {
            return {
                owner: userName,
                file_name: file.name,
                registered_versions: fileNameToSnapshots.get(file.name).map((snapshot) => snapshot.version).sort((a, b) => a - b),
                created_at: file.createdAt.toISOString(),
                updated_at: fileNameToSnapshots.get(file.name).reduce((acc, snapshot) => {
                    return snapshot.created_at > acc ? snapshot.created_at : acc;
                }, file.createdAt).toISOString()
            };
        });
        return publicFileMeta;
    }
}
