import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common';
import { MeService } from '../api/me.service';
import { AbstractAuthService } from '../auth.service';


@Controller('me')
export class MeController<TokenType> {
    constructor(private meService: MeService<TokenType>) {}

    @Get('files')
    async getFiles() {
        return await this.meService.getMyFiles();
    }

    @Post('files/:fileName')
    async postFile(@Param('fileName') fileName: string) {
        return await this.meService.createMyFile(fileName);
    }

    @Get('files/:fileName')
    async getFile(@Param('fileName') fileName: string) {
        return await this.meService.getMyFile(fileName);
    }

    @Delete('files/:fileName')
    async deleteFile(@Param('fileName') fileName: string) {
        return await this.meService.deleteMyFile(fileName);
    }

    @Patch('files/:fileName')
    async patchFile(@Param('fileName') fileName: string, @Body() body: string) {
        return await this.meService.uploadMySnapshot(fileName, body);
    }

    @Post('files/:fileName/:version/register')
    async postPermalink(@Param('fileName') fileName: string, @Param('version') version: number) {
        return await this.meService.createMyPermalink(fileName, version);
    }

    @Post('files/:fileName/:version/permalink')
    async postSnapshot(@Param('fileName') fileName: string, @Param('version') version: number) {
        return await this.meService.registerMySnapshot(fileName, version);
    }
}
