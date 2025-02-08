import { RepositoryService } from '@/repository.service';

import { HttpException, Injectable } from '@nestjs/common';
import { AbstractAuthService } from '@/auth.service';
import { AbstractCodeAnalyzerService } from '@/kernel/index';
import {
  UserInfo,
  Registration,
  SnapshotSaveResponse,
  SnapshotRegisterResponse,
  SourceCodeWrapper,
  Snapshot,
  SnapshotMeta,
  PrivateFileMeta,
} from '@/generated/openapi/model/models';
import { isValidTag, getSnapshotId } from '@/utils';

import {
  DbGetQueryError,
  DbDeleteQueryError,
  DbSetQueryError,
  DbInternalError,
  DbNotFoundError,
  DbDuplicateError,
} from '@/repository.service/fromThrowable';

@Injectable()
export class MeService {
  private repo: RepositoryService;
  private auth: AbstractAuthService;
  private analyzer: AbstractCodeAnalyzerService;

  constructor(
    private repositoryService: RepositoryService,
    private authService: AbstractAuthService,
    private codeAnalyzerService: AbstractCodeAnalyzerService,
  ) {
    this.repo = repositoryService;
    this.auth = authService;
    this.analyzer = codeAnalyzerService;
  }

  public async deleteMyFile(fileName: string, auth: string): Promise<null> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    (await this.repo.deleteFile(userName, fileName)).match(
      () => {},
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return null;
  }

  public async getMyFile(
    fileName: string,
    auth: string,
  ): Promise<PrivateFileMeta> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const file = (
      await this.repo.getFileWithSnapshots(userName, fileName)
    ).match(
      (file) => file,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      owner: userName,
      fileName: fileName,
      versions: file.snapshots.map((snapshot) => snapshot.version),
      registeredVersions: file.snapshots
        .filter((snapshot) => snapshot.isPublic)
        .map((snapshot) => snapshot.version),
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.snapshots
        .reduce((acc, snapshot) => {
          return snapshot.createdAt > acc ? snapshot.createdAt : acc;
        }, file.createdAt)
        .toISOString(),
    };
  }

  public async uploadMySnapshot(
    fileName: string,
    body: SourceCodeWrapper,
    auth: string,
  ): Promise<SnapshotSaveResponse> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    // duplicate save check
    const file = (
      await this.repo.getFileWithSnapshots(userName, fileName)
    ).match(
      (file) => file,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    if (file.snapshots.length !== 0) {
      const lastSnapshotVersion = file.snapshots[file.snapshots.length - 1];
      const lastSnapshot = (
        await this.repo.getSnapshotWithContent(
          userName,
          fileName,
          lastSnapshotVersion.version,
        )
      ).match(
        (snapshot) => snapshot,
        (error) => {
          if (error instanceof DbNotFoundError) {
            throw new HttpException('Internal Error', 500);
          }
          throw new HttpException('Internal Error', 500);
        },
      );
      if (lastSnapshot.content.content === body.content) {
        return {
          result: 'already_saved',
          snapshot: {
            id: getSnapshotId(userName, fileName, lastSnapshotVersion.version),
            owner: userName,
            fileName: fileName,
            version: lastSnapshotVersion.version,
            registered: lastSnapshot.isPublic,
            createdAt: lastSnapshot.createdAt.toISOString(),
          },
        };
      }
    }
    const thisSnapshot = (
      await this.repo.createSnapshot(userName, fileName, body.content)
    ).match(
      (snapshot) => snapshot,
      (error) => {
        if (error instanceof DbInternalError) {
          throw new HttpException('Internal Error', 500);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      result: 'newly_saved',
      snapshot: {
        id: getSnapshotId(userName, fileName, thisSnapshot.version),
        owner: userName,
        fileName: fileName,
        version: thisSnapshot.version,
        registered: false,
        createdAt: thisSnapshot.createdAt.toISOString(),
      },
    };
  }

  public async getMySnapshot(
    fileName: string,
    versionStr: string,
    auth: string,
  ): Promise<Snapshot> {
    let version: number;
    try {
      version = parseInt(versionStr);
    } catch (err) {
      throw new HttpException('Invalid version', 400);
    }
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const snapshot = (
      await this.repo.getSnapshotWithContent(userName, fileName, version)
    ).match(
      (snapshot) => snapshot,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      meta: {
        id: getSnapshotId(userName, fileName, version),
        owner: userName,
        fileName: fileName,
        version: snapshot.version,
        registered: snapshot.isPublic,
        createdAt: snapshot.createdAt.toISOString(),
      },
      content: snapshot.content.content,
    };
  }

  public async createMyFile(
    fileName: string,
    auth: string,
  ): Promise<PrivateFileMeta> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const isValidFileName = /^[a-zA-Z0-9-]+$/.test(fileName);
    if (!isValidFileName) {
      throw new HttpException('Invalid file name', 400);
    }
    const file = (await this.repo.createFile(userName, fileName)).match(
      (file) => file,
      (error) => {
        if (error instanceof DbDuplicateError) {
          throw new HttpException('Resource already exists', 409);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    const snapshot = (
      await this.repo.createSnapshot(
        userName,
        fileName,
        '# Welcome to Lapisla! Write your proof here.\n',
      )
    ).match(
      (snapshot) => snapshot,
      (error) => {
        if (error instanceof DbInternalError) {
          throw new HttpException('Internal Error', 500);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      owner: userName,
      fileName: fileName,
      versions: [0],
      registeredVersions: [],
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.createdAt.toISOString(),
    };
  }

  public async registerMySnapshot(
    fileName: string,
    versionStr: string,
    auth: string,
  ): Promise<SnapshotRegisterResponse> {
    let version: number;
    try {
      version = parseInt(versionStr);
    } catch (err) {
      throw new HttpException('Invalid version', 400);
    }
    // Get username
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const snapshot = (
      await this.repo.getSnapshotWithContent(userName, fileName, version)
    ).match(
      (snapshot) => snapshot,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    if (snapshot.isPublic) {
      return {
        result: SnapshotRegisterResponse.ResultEnum.AlreadyRegistered,
      };
    }
    const dependencies = this.analyzer
      .listDirectDependencies(snapshot.content.content)
      .match(
        (deps) => {
          if (deps.kind === 'invalid_source') {
            throw new HttpException('Invalid source code', 400);
          }
          return deps.value;
        },
        () => {
          throw new HttpException('Internal Error', 500);
        },
      );
    const dependencyContents = (
      await this.repo.getPublicSnapshotsWithContent(dependencies)
    ).match(
      (deps) => {
        if (deps.length !== dependencies.length) {
          throw new HttpException('Dependency not found', 404);
        }
        return deps;
      },
      () => {
        throw new HttpException('Internal Error', 500);
      },
    );
    const validationResult = await this.analyzer.validate(
      snapshot.content.content,
      dependencyContents.map((dep, i) => {
        return {
          metadata: dep,
          source: dep.content.content,
        };
      }),
    );
    if (validationResult.kind === 'source_error') {
      return {
        result: SnapshotRegisterResponse.ResultEnum.Invalid,
      };
    }
    if (validationResult.kind === 'kernel_error') {
      throw new HttpException('Internal Error', 500);
    }
    if (!validationResult.success) {
      throw new HttpException('Internal Error', 500);
    }
    dependencies.push({
      ownerName: userName,
      fileName: fileName,
      version: version,
    });
    (
      await this.repo.setDependencies(userName, fileName, version, dependencies)
    ).match(
      () => {},
      (error) => {
        throw new HttpException('Internal Error', 500);
      },
    );
    (await this.repo.publishSnapshot(userName, fileName, version)).match(
      () => {},
      (error) => {
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      result: SnapshotRegisterResponse.ResultEnum.Registered,
    };
  }

  public async getMyFiles(auth: string): Promise<PrivateFileMeta[]> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const user = (await this.repo.getUserWithFilesAndSnapshots(userName)).match(
      (user) => user,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return user.files.map((file) => {
      return {
        owner: userName,
        fileName: file.fileName,
        versions: file.snapshots.map((snapshot) => snapshot.version),
        registeredVersions: file.snapshots
          .filter((snapshot) => snapshot.isPublic)
          .map((snapshot) => snapshot.version),
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.snapshots
          .reduce((acc, snapshot) => {
            return snapshot.createdAt > acc ? snapshot.createdAt : acc;
          }, file.createdAt)
          .toISOString(),
      };
    });
  }

  public async updateTagsAndDescription(
    fileName: string,
    version: string,
    body: Registration,
    auth: string,
  ): Promise<SnapshotMeta> {
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
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      () => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const snapshot = (
      await this.repo.updateTagsAndDescription(
        userName,
        fileName,
        versionNumber,
        body.tags,
        body.description,
      )
    ).match(
      (snapshot) => snapshot,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      id: getSnapshotId(userName, fileName, versionNumber),
      owner: userName,
      fileName: fileName,
      version: versionNumber,
      registered: snapshot.isPublic,
      createdAt: snapshot.createdAt.toISOString(),
    };
  }

  async getMyUser(auth: string): Promise<UserInfo> {
    const userName = (await this.auth.authenticate(auth)).match(
      (user) => user,
      (_) => {
        throw new HttpException('Unauthorized', 401);
      },
    );
    const user = (await this.repo.getUser(userName)).match(
      (user) => user,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    return {
      username: user.userName,
      github_id: user.githubId,
    };
  }
}
