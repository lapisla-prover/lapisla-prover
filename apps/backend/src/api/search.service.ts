import { SearchService } from '../generated/openapi/api/search.service';
import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { SearchSnapshotsQueryParameter } from '../generated/openapi/model/searchSnapshotsQueryParameter';
import { SearchResult } from '../generated/openapi/model/searchResult';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MySearchService extends SearchService {

    protected prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }

    /**
     * Search for public snapshots
     * 
     * @param query 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public searchSnapshots(query: SearchSnapshotsQueryParameter, ): Observable<AxiosResponse<SearchResult>> {
        console.log("Search GET called");
        throw new Error('Method not implemented.');
    }
}
