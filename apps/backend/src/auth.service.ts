import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "neverthrow";
import { PrismaService } from "./prisma.service";

@Injectable()
export abstract class AbstractAuthService {
    constructor() {}

    abstract newToken(userId: string): Promise<string>;

    abstract authenticate(token: string): Promise<Result<string, string>>;
}

@Injectable()
export class MockAuthService extends AbstractAuthService {
    constructor() {
        super();
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
    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        super();
        this.prisma = prismaService;
    }


    async newToken(userName: string): Promise<string> {
        const session = await this.prisma.sessions.create({
            data: {
                value: userName,
            }
        });

        return session.sessionId;
    }

    async authenticate(token: string): Promise<Result<string, string>> {
        const session = await this.prisma.sessions.findUnique({
            where: {
                sessionId: token
            }
        });

        if (session === null) {
            return new Err("Invalid token");
        }else{
            return new Ok(session.value);
        }
    }
}