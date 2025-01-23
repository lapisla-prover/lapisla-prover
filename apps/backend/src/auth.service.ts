import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "neverthrow";

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