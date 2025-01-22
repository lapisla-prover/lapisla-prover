import { MeService } from '../generated/openapi/api/me.service';
import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { PrivateFileMeta } from '../generated/openapi/model/privateFileMeta';
import { SnapshotMeta } from '../generated/openapi/model/snapshotMeta';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MyMeService extends MeService {

    private prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }

    /**
     * Delete a file
     * 
     * @param fileName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteMyFile(fileName: string, ): Observable<AxiosResponse<any>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Fetch a private file
     * 
     * @param fileName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMyFile(fileName: string, ): Observable<AxiosResponse<PrivateFileMeta>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Upload a snapshot of the file
     * 
     * @param fileName 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadMySnapshot(fileName: string, body?: string, ): Observable<AxiosResponse<SnapshotMeta>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Create a new file
     * 
     * @param fileName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createMyFile(fileName: string, ): Observable<AxiosResponse<PrivateFileMeta>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Create a permalink to the snapshot
     * 
     * @param fileName 
     * @param version 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createMyPermalink(fileName: string, version: number, ): Observable<AxiosResponse<string>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Register a snapshot to the public registry
     * 
     * @param fileName 
     * @param version 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public registerMySnapshot(fileName: string, version: number, ): Observable<AxiosResponse<any>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Get metadata of all files owned by the user
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMyFiles(): Observable<AxiosResponse<Array<PrivateFileMeta>>> {
        throw new Error('Method not implemented.');
    }
}
