import { PrismaService } from '../prisma.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { AbstractSearchLogicService } from 'src/searchlogic';
import { SearchCandidate } from 'src/searchlogic';
import { getSnapshotInfoFromId } from 'src/utils';

// ReturnType is the snapshots.id in db
@Injectable()
export class SearchService {

    protected prisma: PrismaService;
    protected searchLogic: AbstractSearchLogicService<string>;
    protected searchCandidatesCache: SearchCandidate<string>[] = [];
    protected cacheTimestamp: number = Date.now();
    protected cacheTimeoutSeconds: number = 60;

    constructor(private prismaService: PrismaService, protected searchLogicService: AbstractSearchLogicService<string>) {
        this.prisma = prismaService;
        this.searchLogic = searchLogicService;
    }

    public async searchSnapshots(query: string, offset: number = 0, limit: number = 5, before: string | undefined): Promise<SearchResult> {
        const searchCandidates = await this.listSnapshots(before);
        console.log(searchCandidates);
        const searchResults = await this.searchLogic.search(query, offset, limit, searchCandidates);
        console.log(searchResults);
        const snapshotsMeta = await this.prisma.snapshots.findMany({
            where: {
                id: {
                    in: searchResults
                }
            }
        })
        console.log(snapshotsMeta);
        return {
            results: snapshotsMeta.map(snapshot => {
                const snapInfo = getSnapshotInfoFromId(snapshot.snapshotId).match(
                    val => val,
                    () => { throw new HttpException('Invalid snapshot id', 400);}
                );
                return {
                    id: snapshot.snapshotId,
                    owner: snapInfo.owner,
                    fileName: snapInfo.fileName,
                    version: snapInfo.version,
                    source: snapshot.content,
                    createdAt: snapshot.createdAt.toISOString()
                }
            }),
            before: before,
            offset: offset,
        }
    }

    private async listSnapshots(before: string | undefined): Promise<SearchCandidate<string>[]> {
        const now = Date.now();
        const beforeActual = before ? new Date(before) : new Date(now);
        if (this.searchCandidatesCache.length > 0 && now - this.cacheTimestamp < this.cacheTimeoutSeconds * 1000 && beforeActual >= new Date(this.cacheTimestamp)) {
            return this.searchCandidatesCache;
        }
        const snapshots = await this.prisma.snapshots.findMany({
            where: {
                createdAt: {
                    lt: new Date(beforeActual)
                },
                isPublic: true
            }
        })
        this.searchCandidatesCache = snapshots.map(snapshot => {
            const snapInfo = getSnapshotInfoFromId(snapshot.snapshotId).match(
                val => val,
                () => { throw new HttpException('Invalid snapshot id', 400);}
            );
            return {
                owner: snapInfo.owner,
                fileName: snapInfo.fileName,
                version: snapInfo.version.toString(),
                source: snapshot.content,
                returnVal: snapshot.id
            }
        });
        this.cacheTimestamp = now;
        return this.searchCandidatesCache;
    }
}
