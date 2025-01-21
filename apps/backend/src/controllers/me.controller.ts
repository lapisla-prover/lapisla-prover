import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common';
import { MeService } from '../generated/openapi';


@Controller('me')
export class MeController {
    constructor(private meService: MeService) {}

    @Get('files')
    getFiles() {
        return this.meService.meFilesGet();
    }

    @Post('files/:fileName')
    postFile(@Param('fileName') fileName: string) {
        return this.meService.meFilesFileNamePost(fileName);
    }

    @Get('files/:fileName')
    getFile(@Param('fileName') fileName: string) {
        return this.meService.meFilesFileNameGet(fileName);
    }

    @Delete('files/:fileName')
    deleteFile(@Param('fileName') fileName: string) {
        return this.meService.meFilesFileNameDelete(fileName);
    }

    @Patch('files/:fileName')
    patchFile(@Param('fileName') fileName: string, @Body() body: string) {
        return this.meService.meFilesFileNamePatch(fileName, body);
    }

    @Post('files/:fileName/:version/register')
    postPermalink(@Param('fileName') fileName: string, @Param('version') version: number) {
        return this.meService.meFilesFileNameVersionPermalinkPost(fileName, version);
    }

    @Post('files/:fileName/:version/permalink')
    postSnapshot(@Param('fileName') fileName: string, @Param('version') version: number) {
        return this.meService.meFilesFileNameVersionPermalinkPost(fileName, version);
    }
}
