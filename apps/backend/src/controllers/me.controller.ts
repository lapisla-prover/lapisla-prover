import { Controller, Get, Post, Delete, Patch, Param, Query, Body, Headers } from '@nestjs/common';
import { MeService } from '../api/me.service';
import { AbstractAuthService } from '../auth.service';
import { SourceCodeWrapper } from 'src/generated/openapi';


@Controller('me')
export class MeController {
    constructor(private meService: MeService) {}

    @Get('files')
    async getFiles(@Headers('Authorization') authHeader: string) {
        return await this.meService.getMyFiles(authHeader);
    }

    @Post('files/:fileName')
    async postFile(@Param('fileName') fileName: string, @Headers('Authorization') authHeader: string) {
        return await this.meService.createMyFile(fileName, authHeader);
    }

    @Get('files/:fileName')
    async getFile(@Param('fileName') fileName: string, @Headers('Authorization') authHeader: string) {
        return await this.meService.getMyFile(fileName, authHeader);
    }

    @Delete('files/:fileName')
    async deleteFile(@Param('fileName') fileName: string, @Headers('Authorization') authHeader: string) {
        return await this.meService.deleteMyFile(fileName, authHeader);
    }

    @Patch('files/:fileName')
    async patchFile(@Param('fileName') fileName: string, @Body() body: SourceCodeWrapper & {}, @Headers('Authorization') authHeader: string) {
        return await this.meService.uploadMySnapshot(fileName, body, authHeader);
    }

    @Post('files/:fileName/:version/register')
    async registerSnapshot(@Param('fileName') fileName: string, @Param('version') version: string, @Headers('Authorization') authHeader: string) {
        return await this.meService.registerMySnapshot(fileName, version, authHeader);
    }

    @Get('files/:fileName/:version')
    async getSnapshot(@Param('fileName') fileName: string, @Param('version') version: string, @Headers('Authorization') authHeader: string) {
        return await this.meService.getMySnapshot(fileName, version, authHeader);
    }
}
