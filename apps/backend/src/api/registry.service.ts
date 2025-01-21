import { RegistryService } from '../generated/openapi/api/registry.service';
import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { Project } from '../generated/openapi/model/project';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MyRegistryService extends RegistryService {

    protected prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }

    /**
     * Get the project dependencies of a snapshot
     * 
     * @param snapshotId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public registrySnapshotIdGet(snapshotId: string, ): Observable<AxiosResponse<Project>> {
        throw new Error('Method not implemented.');
    }
}
