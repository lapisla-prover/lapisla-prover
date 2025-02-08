import { RepositoryService } from '@/repository.service';
import { getSnapshotId } from 'src/utils';

import { Injectable, Optional, HttpException } from '@nestjs/common';
import { PublicFileMeta } from '../generated/openapi/model/publicFileMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { SnapshotMeta } from 'src/generated/openapi/model/snapshotMeta';

import {
  DbGetQueryError,
  DbDeleteQueryError,
  DbSetQueryError,
  DbInternalError,
  DbNotFoundError,
  DbDuplicateError,
} from '@/repository.service/fromThrowable';

@Injectable()
export class FilesService {
  protected repo: RepositoryService;

  constructor(private repositoryService: RepositoryService) {
    this.repo = repositoryService;
  }


  public async getPublicFile(
    userName: string,
    fileName: string,
  ): Promise<PublicFileMeta> {
    const file = (await this.repo.getPublicFileWithPublicSnapshots(
      userName,
      fileName,
    ))
      .match(
        (file) => file,
        (error) => {
          if (error instanceof DbNotFoundError) {
            throw new HttpException('Resource not found', 404);
          }
          throw new HttpException('Internal Error', 500);
        },
      )
    const fileMeta: PublicFileMeta = {
      owner: userName,
      fileName: fileName,
      registeredVersions: file.snapshots
        .map((snapshot) => snapshot.version)
        .sort((a, b) => a - b),
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.snapshots
        .reduce((acc, snapshot) => {
          return snapshot.createdAt > acc ? snapshot.createdAt : acc;
        }, file.createdAt)
        .toISOString(),
    };
    return fileMeta;
  }


  public async getPublicSnapshot(
    userName: string,
    fileName: string,
    version: string,
  ): Promise<Snapshot> {
    const publicSnapshot = (await this.repo.getPublicSnapshotWithContent(
      userName,
      fileName,
      parseInt(version),
    ))
      .match(
        (snapshot) => {
          if (!snapshot.isPublic) {
            throw new HttpException('Resource not found', 404);
          }
          return snapshot;
        },
        (error) => {
          if (error instanceof DbNotFoundError) {
            throw new HttpException('Resource not found', 404);
          }
          throw new HttpException('Internal Error', 500);
        },
      );
    const snapshotMeta: SnapshotMeta = {
      id: getSnapshotId(userName, fileName, parseInt(version)),
      owner: userName,
      fileName: fileName,
      version: parseInt(version),
      registered: publicSnapshot.isPublic,
      createdAt: publicSnapshot.createdAt.toISOString(),
    };
    return {
      meta: snapshotMeta,
      content: publicSnapshot.content.content,
    };
  }

  public async getPublicFiles(userName: string): Promise<PublicFileMeta[]> {
    const user = (await this.repo.getUserWithPublicFilesAndSnapshots(userName)).match(
      (user) => user,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    const publicFileMeta: PublicFileMeta[] = user.files.map((file) => {
      return {
        owner: userName,
        fileName: file.fileName,
        registeredVersions: file.snapshots.map((snapshot) => snapshot.version),
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.snapshots
          .map((snapshot) => snapshot.createdAt)
          .reduce((acc, cur) => (cur > acc ? cur : acc), file.createdAt)
          .toISOString(),
      };
    });
    return publicFileMeta;
  }
}
