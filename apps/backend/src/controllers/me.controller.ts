import { Controller, Get, Post, Delete, Patch, Param, Query, Body, Headers, Req } from '@nestjs/common';
import { MeService } from '../api/me.service';
import { AbstractAuthService } from '../auth.service';
import { SourceCodeWrapper } from 'src/generated/openapi'
import { Request } from 'express';


@Controller('me')
export class MeController {
    constructor(private meService: MeService) {}

    @Get('files')
    async getFiles(@Req() req: Request) {
        return await this.meService.getMyFiles(req.cookies['session_id']);
    }

    @Post('files/:fileName')
    async postFile(@Param('fileName') fileName: string, @Req() req: Request) {;
        return await this.meService.createMyFile(fileName, req.cookies['session_id']);
    }

    @Get('files/:fileName')
    async getFile(@Param('fileName') fileName: string, @Req() req: Request) {
        return await this.meService.getMyFile(fileName, req.cookies['session_id']);
    }

    @Delete('files/:fileName')
    async deleteFile(@Param('fileName') fileName: string, @Req() req: Request) {
        return await this.meService.deleteMyFile(fileName, req.cookies['session_id']);
    }

    @Patch('files/:fileName')
    async patchFile(@Param('fileName') fileName: string, @Body() body: SourceCodeWrapper & {}, @Req() req: Request) {
        return await this.meService.uploadMySnapshot(fileName, body, req.cookies['session_id']);
    }

    @Post('files/:fileName/:version/register')
    async registerSnapshot(@Param('fileName') fileName: string, @Param('version') version: string, @Req() req: Request) {
        return await this.meService.registerMySnapshot(fileName, version, req.cookies['session_id']);
    }

    @Get('files/:fileName/:version')
    async getSnapshot(@Param('fileName') fileName: string, @Param('version') version: string, @Req() req: Request) {
        return await this.meService.getMySnapshot(fileName, version, req.cookies['session_id']);
    }
}
