import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoginService } from '../api/login.service';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Get()
    async login() {
        return await this.loginService.loginWithGitHub();
    }

    @Get('callback')
    async loginCallback(@Query('code') code: string, @Query('state') state: string) {
        return await this.loginService.callbackGitHubOAuth(code, state);
    }
}
