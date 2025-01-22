import { LoginService } from '../generated/openapi/api/login.service';
import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class MyLoginService extends LoginService {

    protected prisma: PrismaService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration, private prismaService: PrismaService) {
        super(httpClient, configuration);
        this.prisma = prismaService;
    }

    /**
     * Callback for GitHub OAuth
     * 
     * @param code 
     * @param state 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public callbackGitHubOAuth(code: string, state: string, ): Observable<AxiosResponse<any>> {
        throw new Error('Method not implemented.');
    }
    /**
     * Login with GitHub
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public loginWithGitHub(): Observable<AxiosResponse<any>> {
        throw new Error('Method not implemented.');
    }
}
