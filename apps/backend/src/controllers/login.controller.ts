import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { LoginService } from '../api/login.service';
import { Request, Response } from 'express';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Get()
    async login(@Res() res: Response) {
        const {state_id, url} = await this.loginService.loginWithGitHub();
        res.cookie('state_id', state_id, { httpOnly: true });
        res.redirect(url);
    }

    @Get('callback')
    async loginCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response, @Req() req: Request) {
        const state_id = req.cookies['state_id'];
        const {session_id, url} = await this.loginService.callbackGitHubOAuth(code, state, state_id);
        res.cookie('session_id', session_id, { httpOnly: true });
        res.redirect(url);
    }
}
