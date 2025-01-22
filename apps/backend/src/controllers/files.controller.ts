import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilesService } from '../generated/openapi';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    @Get(':userName')
    getFiles(@Param('userName') userName: string) {
        return this.filesService.getPublicFiles(userName);
    }

    @Get(':userName/:fileName')
    getFile(@Param('userName') userName: string, @Param('fileName') fileName: string) {
        return this.filesService.getPublicFile(userName, fileName);
    }

    @Get(':userName/:fileName/version')
    getFileVersion(@Param('userName') userName: string, @Param('fileName') fileName: string, @Query('version') version: number) {
        return this.filesService.getPublicSnapshot(userName, fileName, version);
    }
}
