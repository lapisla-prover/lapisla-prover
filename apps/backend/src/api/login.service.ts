import { RepositoryService } from '../repository.service';

import { HttpException, Injectable, Optional } from '@nestjs/common';
import { AbstractAuthService } from '../auth.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { DbDuplicateError } from '@/repository.service/fromThrowable';

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

const randomString = (len: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let array = crypto.getRandomValues(new Uint32Array(len));
  array = array.map((val) => characters.charCodeAt(val % charactersLength));
  return String.fromCharCode(...array);
};

@Injectable()
export class LoginService {
  protected repo: RepositoryService;
  protected auth: AbstractAuthService;

  constructor(
    private repositoryService: RepositoryService,
    private authService: AbstractAuthService,
  ) {
    this.repo = repositoryService;
    this.auth = authService;
  }

  public async callbackGitHubOAuth(
    code: string,
    state: string,
    state_id,
  ): Promise<{ session_id: string; url: string }> {
    const session_state = await this.auth.getState(state_id);
    if (state !== session_state) {
      throw new HttpException('Invalid state', 400);
    }

    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    const accessToken: GithubAccessTokenResponse = await axios
      .post(
        `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .then((res) => {
        const param = new URLSearchParams(res.data);
        return {
          access_token: param.get('access_token'),
          token_type: param.get('token_type'),
          scope: param.get('scope'),
        };
      });

    if (!accessToken.access_token) {
      throw new HttpException('Invalid code', 400);
    }

    const user: GithubUserResponse = await axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `bearer ${accessToken.access_token}`,
        },
      })
      .then((res) => res.data);

    const userName = user.login;
    const githubId = user.id;

    (await this.repo.createUser(userName, githubId)).match(
      () => {},
      (error) => {
        if (error.code !== 'DuplicateError') {
          throw new HttpException('Internal Error', 500);
        }
      },
    );

    const session_id = await this.auth.newToken(userName);

    return { session_id, url: process.env.BASE_URL };
  }

  public async loginWithGitHub(): Promise<{ state_id: string; url: string }> {
    const state = randomString(16);
    const state_id = await this.auth.saveState(state);

    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`;

    return { state_id, url };
  }
}
