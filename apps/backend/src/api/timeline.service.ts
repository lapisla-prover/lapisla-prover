import { PrismaClient } from '@prisma/client';
import { HttpException, Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { AbstractSearchLogicService } from 'src/searchlogic';
import { SearchCandidate } from 'src/searchlogic';
import { getSnapshotId, getSnapshotInfoFromId } from 'src/utils';
import { TimelineEntry } from '../generated/openapi/model/timelineEntry';
import { RepositoryService } from '@/repository.service';

// ReturnType is the snapshots.id in db
@Injectable()
export class TimelineService {

    protected prisma: PrismaClient;

    constructor(private repositoryService: RepositoryService) {
        this.prisma = repositoryService.__doNotUseThisMethodGetPrismaClient();
    }

    public async getTimeline(offset: number, limit: number): Promise<TimelineEntry[]> {
        const latestSnapshots = await this.prisma.snapshot.findMany({
            where: {
                isPublic: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: limit,
            include: {
                tags: true
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        const timelineEntries: TimelineEntry[] = latestSnapshots.map(snapshot => {
            const timelineEntry: TimelineEntry = {
                id: getSnapshotId(snapshot.ownerName, snapshot.fileName, snapshot.version),
                owner: snapshot.ownerName,
                fileName: snapshot.fileName,
                version: snapshot.version,
                registeredAt: snapshot.registeredAt.toISOString(),
                tags: snapshot.tags.map(tag => tag.name)
            }
            return timelineEntry;
        })
        const users = await this.prisma.user.findMany({
            where: {
                userName: {
                        in: timelineEntries.map(entry => entry.owner)
                    }
                }
            });
        const nameToIdMap = new Map<string, string>();
        for (let user of users) {
            nameToIdMap.set(user.userName, user.githubId.toString());
        }
        const timelineEntriesWithGithubId = timelineEntries.map(entry => {
            let newEntry = entry;
            newEntry.ownerGithubId = nameToIdMap.get(entry.owner);
            return newEntry;
        })
        return timelineEntriesWithGithubId;
    }
}
