import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "neverthrow";

@Injectable()
export abstract class AbstractAuthService<TokenType> {
    constructor() {}

    abstract newToken(userId: string): Promise<TokenType>;

    abstract authenticate(token: TokenType): Promise<Result<string, string>>;
}

@Injectable()
export class MockAuthService extends AbstractAuthService<string> {
    constructor() {
        super();
    }

    async newToken(userId: string): Promise<string> {
        return 'mockToken_for_' + userId;
    }

    async authenticate(token: string): Promise<Result<string, string>> {
        if (token.startsWith('mockToken_for_')) {
            return new Ok(token.substring('mockToken_for_'.length));
        } else {
            return new Err('Invalid token');
        }
    }
}