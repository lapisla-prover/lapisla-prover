import { Injectable } from '@nestjs/common';
import { Result, Ok, Err } from 'neverthrow';
import { PrismaClient } from '@prisma/client';
import { RepositoryService } from './repository.service';

@Injectable()
export abstract class AbstractAuthService {
  constructor() {}

  abstract saveState(state: string): Promise<string>;

  abstract getState(state_id: string): Promise<string>;

  abstract newToken(userId: string): Promise<string>;

  abstract authenticate(token: string): Promise<Result<string, string>>;
}

@Injectable()
export class MockAuthService extends AbstractAuthService {
  constructor() {
    super();
  }

  async saveState(state: string): Promise<string> {
    return 'mockState';
  }

  async getState(state_id: string): Promise<string> {
    return 'mockState';
  }

  async newToken(userId: string): Promise<string> {
    return 'mockToken_for_' + userId;
  }

  async authenticate(token: string): Promise<Result<string, string>> {
    return new Ok('testuser');
  }
}

@Injectable()
export class AuthService extends AbstractAuthService {
  protected prisma: PrismaClient;

  constructor(private repositoryService: RepositoryService) {
    super();
    this.prisma = repositoryService.__doNotUseThisMethodGetPrismaClient();
  }

  async saveState(state: string): Promise<string> {
    const state_id = await this.prisma.state.create({
      data: {
        state: state,
      },
    });

    return state_id.state;
  }

  async getState(state_id: string): Promise<string> {
    if (!state_id) {
      return '';
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    await this.prisma.state.deleteMany({
      where: {
        createdAt: {
          lt: fiveMinutesAgo,
        },
      },
    });

    const state = await this.prisma.state.findUnique({
      where: {
        id: state_id,
      },
    });

    if (state === null) {
      return '';
    }

    return state.state;
  }

  async newToken(userName: string): Promise<string> {
    const session = await this.prisma.session.create({
      data: {
        value: userName,
      },
    });

    return session.sessionId;
  }

  async authenticate(token: string): Promise<Result<string, string>> {
    if (!token) {
      return new Err('Invalid token');
    }

    const session = await this.prisma.session.findUnique({
      where: {
        sessionId: token,
      },
    });

    if (session === null) {
      return new Err('Invalid token');
    } else {
      return new Ok(session.value);
    }
  }
}
