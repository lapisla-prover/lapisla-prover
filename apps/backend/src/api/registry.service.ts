import { RepositoryService } from '@/repository.service';

import { DbNotFoundError } from '@/repository.service/fromThrowable';

import { getSnapshotInfoFromId, getSnapshotId } from '@/utils';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ProjectFetchResult, Project } from '@/generated/openapi/model/models';

@Injectable()
export class RegistryService {
  protected repo: RepositoryService;

  constructor(private repositoryService: RepositoryService) {
    this.repo = repositoryService;
  }

  public async getProjectDependencies(
    snapshotId: string,
  ): Promise<ProjectFetchResult> {
    let snapshotInfo = getSnapshotInfoFromId(snapshotId).match(
      (info) => info,
      () => {
        throw new HttpException('Invalid snapshot id', 400);
      },
    );
    const dependencies = (
      await this.repo.getDependencies(
        snapshotInfo.owner,
        snapshotInfo.fileName,
        snapshotInfo.version,
      )
    ).match(
      (deps) => deps,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new HttpException('Resource not found', 404);
        }
        throw new HttpException('Internal Error', 500);
      },
    );
    const project: Project = {
      id: snapshotId,
      dependencies: dependencies.dependTo.map((dep) => {
        return {
          id: getSnapshotId(dep.ownerName, dep.fileName, dep.version),
          snapshot: {
            meta: {
              id: getSnapshotId(dep.ownerName, dep.fileName, dep.version),
              owner: dep.ownerName,
              fileName: dep.fileName,
              version: dep.version,
              createdAt: dep.createdAt.toISOString(),
              isRegistered: true,
            },
            content: dep.content.content,
          },
        };
      }),
    };
    return {
      result: ProjectFetchResult.ResultEnum.Ok,
      ok: project,
    };
  }
}
