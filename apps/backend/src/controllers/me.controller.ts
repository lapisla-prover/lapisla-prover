import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common';
import { MeService } from '../generated/openapi';


@Controller('me')
export class MeController {
    constructor(private meService: MeService) {}

    @Get('files')
    getFiles() {
        return this.meService.getMyFiles();
    }

    @Post('files/:fileName')
    postFile(@Param('fileName') fileName: string) {
        return this.meService.createMyFile(fileName);
    }

    @Get('files/:fileName')
    getFile(@Param('fileName') fileName: string) {
        return this.meService.getMyFile(fileName);
    }

    @Delete('files/:fileName')
    deleteFile(@Param('fileName') fileName: string) {
        return this.meService.deleteMyFile(fileName);
    }

    @Patch('files/:fileName')
    patchFile(@Param('fileName') fileName: string, @Body() body: string) {
        return this.meService.uploadMySnapshot(fileName, body);
    }

    @Post('files/:fileName/:version/register')
    postPermalink(@Param('fileName') fileName: string, @Param('version') version: number) {
        return this.meService.createMyPermalink(fileName, version);
    }

    @Post('files/:fileName/:version/permalink')
    postSnapshot(@Param('fileName') fileName: string, @Param('version') version: number) {
        return this.meService.registerMySnapshot(fileName, version);
    }
}
