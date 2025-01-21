import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoginService } from '../generated/openapi';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Get()
    login() {
        return this.loginService.loginGet();
    }

    @Get('callback')
    loginCallback(@Query('code') code: string, @Query('state') state: string) {
        return this.loginService.loginCallbackGet(code, state);
    }
}
