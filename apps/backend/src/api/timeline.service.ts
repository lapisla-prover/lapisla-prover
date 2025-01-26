import { PrismaService } from '../prisma.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { AbstractSearchLogicService } from 'src/searchlogic';
import { SearchCandidate } from 'src/searchlogic';
import { getSnapshotInfoFromId } from 'src/utils';
import { TimelineEntry } from '../generated/openapi/model/timelineEntry';

// ReturnType is the snapshots.id in db
@Injectable()
export class TimelineService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService, protected searchLogicService: AbstractSearchLogicService<string>) {
        this.prisma = prismaService;
    }

    public async getTimeline(offset: number, limit: number): Promise<TimelineEntry[]> {
        const latestSnapshots = await this.prisma.snapshots.findMany({
            where: {
                isPublic: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: limit,
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        })
            .catch((err) => {
                throw new HttpException('Internal Error', 500);
            });
        const timelineEntries: TimelineEntry[] = latestSnapshots.map(snapshot => {
            const snapshotInfo = getSnapshotInfoFromId(snapshot.snapshotId).match(
                val => val,
                () => { throw new HttpException('Internal Error', 500); }
            );
            const timelineEntry: TimelineEntry = {
                id: snapshot.snapshotId,
                owner: snapshotInfo.owner,
                fileName: snapshotInfo.fileName,
                version: snapshotInfo.version,
                registeredAt: snapshot.registeredAt.toISOString(),
                tags: snapshot.tags.map(tag => tag.tag.name)
            }
            return timelineEntry;
        })
        const users = await this.prisma.users.findMany({
            where: {
                name: {
                    in: timelineEntries.map(entry => entry.owner)
                    }
                }
            });
        const nameToIdMap = new Map<string, string>();
        for (let user of users) {
            nameToIdMap.set(user.name, user.githubId.toString());
        }
        const timelineEntriesWithGithubId = timelineEntries.map(entry => {
            let newEntry = entry;
            newEntry.ownerGithubId = nameToIdMap.get(entry.owner);
            return newEntry;
        })
        return timelineEntriesWithGithubId;
    }
}
