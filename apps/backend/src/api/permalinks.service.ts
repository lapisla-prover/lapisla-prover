import { PermalinksService } from '../generated/openapi/api/permalinks.service';
import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MyPermalinksService extends PermalinksService {

    protected prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }

    /**
     * Fetch a snapshot by permalink
     * 
     * @param permalinkId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPermalink(permalinkId: string, ): Observable<AxiosResponse<Snapshot>> {
        throw new Error('Method not implemented.');
    }
}
