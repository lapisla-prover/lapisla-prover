import { FilesService } from '../generated/openapi/api/files.service';
import { PrismaService } from '../prisma.service';


import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { PublicFileMeta } from '../generated/openapi/model/publicFileMeta';
import { Snapshot } from '../generated/openapi/model/snapshot';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MyFilesService extends FilesService{

    protected prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }



    /**
     * Fetch a public file
     * 
     * @param userName 
     * @param fileName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPublicFile(userName: string, fileName: string, ): Observable<AxiosResponse<PublicFileMeta>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Fetch a public snapshot
     * 
     * @param userName 
     * @param fileName 
     * @param version 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPublicSnapshot(userName: string, fileName: string, version: number, ): Observable<AxiosResponse<Snapshot>> {
        throw new Error('Method not implemented.');
    }
   /**
     * Get metadata of all public files owned by the user
     * 
     * @param userName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPublicFiles(userName: string, ): Observable<AxiosResponse<Array<PublicFileMeta>>> {
        throw new Error('Method not implemented.');
    }
}
