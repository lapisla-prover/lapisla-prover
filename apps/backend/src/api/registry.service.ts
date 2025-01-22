import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { Project } from '../generated/openapi/model/project';
import { Configuration } from '../generated/openapi/configuration';
import { COLLECTION_FORMATS } from '../generated/openapi/variables';


@Injectable()
export class RegistryService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async getProjectDependencies(snapshotId: string, ): Promise<Project> {
        throw new Error('Method not implemented.');
    }
}
