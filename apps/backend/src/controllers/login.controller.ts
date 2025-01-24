import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { LoginService } from '../api/login.service';
import { Response } from 'express';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Get()
    async login(@Res() res: Response) {
        const {state, url} = await this.loginService.loginWithGitHub();
        res.cookie('session_id', state, { httpOnly: true, maxAge: 600000 });
        res.redirect(url);
        return res.send(state);
    }

    @Get('callback')
    async loginCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
        const {session_id, url} = await this.loginService.callbackGitHubOAuth(code, state);
        res.cookie('session_id', session_id, { httpOnly: true });
        res.redirect(url);
        return res.send(session_id);
    }
}
