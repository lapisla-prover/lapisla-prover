import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';

@Injectable()
export class LoginService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async callbackGitHubOAuth(code: string, state: string, ): Promise<null> {
        throw new Error('Method not implemented.');
    }
    /**
     * Login with GitHub
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public async loginWithGitHub(): Promise<null> {
        throw new Error('Method not implemented.');
    }
}
