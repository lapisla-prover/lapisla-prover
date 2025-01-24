import { PrismaService } from '../prisma.service';

import { Injectable, Optional } from '@nestjs/common';
import { AbstractAuthService } from '../auth.service';
import axios from 'axios';

type GithubAccessTokenResponse = {
    access_token: string;
    token_type: string;
    scope: string;
};

type GithubUserResponse = {
    id: number;
    name: string;
    login: string;
};
  

@Injectable()
export class LoginService {

    protected prisma: PrismaService;
    protected auth: AbstractAuthService;

    constructor(private prismaService: PrismaService, private authService: AbstractAuthService) {
        this.prisma = prismaService;
        this.auth = authService;
    }

    public async callbackGitHubOAuth(code: string, state: string, ): Promise<{session_id: string, url: string}> {
        const session_state = "10" // get_state_from_session();
        if (state !== session_state) {
            throw new Error('Invalid state');
        }

        const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

        console.log(`code: ${code}`);

        const accessToken: GithubAccessTokenResponse = await axios.post(
            `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        ).then((res) => {
            const param = new URLSearchParams(res.data);
            return {
                access_token: param.get("access_token"),
                token_type: param.get("token_type"),
                scope: param.get("scope"),
            };
        })

        const user: GithubUserResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `bearer ${accessToken.access_token}`,
            },
        }).then((res) => res.data);
        
        const userName = "PonponJuice";

        await this.prisma.users.upsert({
            where: {name: userName},
            update: {},
            create: {name: userName},
        });

        const session_id = await this.auth.newToken(userName);

        return {session_id, url: process.env.BASE_URL};
    }
    
    public async loginWithGitHub(): Promise<{state: string, url: string}> {
        const state = "10" // generate_random_state();
        // TODO: save state to session

        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`;

        return {state, url};
    }
}
