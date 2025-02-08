import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RepositoryService } from '../repository.service';
import { SnapshotMeta } from '@/generated/openapi/model/models';
import { getSnapshotId } from '@/utils';

@Injectable()
export abstract class AbstractSearchLogicService {
  protected prisma: PrismaClient;

  constructor(repositoryService: RepositoryService) {
    this.prisma = repositoryService.__doNotUseThisMethodGetPrismaClient();
  }

  abstract search(
    tags: string[],
    offset: number,
    limit: number,
  ): Promise<SnapshotMeta[]>;
}

@Injectable()
export class SearchLogicService extends AbstractSearchLogicService {
  public async search(
    tags: string[],
  ): Promise<SnapshotMeta[]> {
    const result: SnapshotMeta[] = await this.prisma.snapshot.findMany({
      where: {
        tags: {
          some: {
            name: {
              in: tags,
            },
          },
        },
      },
    })
      .then((snapshots) => snapshots.map((snapshot) => ({
        id: getSnapshotId(snapshot.ownerName, snapshot.fileName, snapshot.version),
        owner: snapshot.ownerName,
        fileName: snapshot.fileName,
        version: snapshot.version,
        license: snapshot.license,
        registered: snapshot.isPublic,
        createdAt: snapshot.createdAt.toISOString(),
      })));
    return result;
  }
}