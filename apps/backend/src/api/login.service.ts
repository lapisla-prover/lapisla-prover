import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';

@Injectable()
export class LoginService {

    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        this.prisma = prismaService;
    }

    public async callbackGitHubOAuth(code: string, state: string, ): Promise<{session_id: string, url: string}> {
        const session_state = "" // get_state_from_session();
        if (state !== session_state) {
            throw new Error('Invalid state');
        }


        return {session_id: "", url: ""};
    }
    
    public async loginWithGitHub(): Promise<{state: string, url: string}> {
        const state = Math.random().toString(36).slice(-8);
        // TODO: save state to session

        const url = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`;

        return {state, url};
    }
}
