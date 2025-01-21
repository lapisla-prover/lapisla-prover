import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilesService } from '../generated/openapi';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    @Get(':userName')
    getFiles(@Param('userName') userName: string) {
        return this.filesService.filesUserNameGet(userName);
    }

    @Get(':userName/:fileName')
    getFile(@Param('userName') userName: string, @Param('fileName') fileName: string) {
        return this.filesService.filesUserNameFileNameGet(userName, fileName);
    }

    @Get(':userName/:fileName/version')
    getFileVersion(@Param('userName') userName: string, @Param('fileName') fileName: string, @Query('version') version: number) {
        return this.filesService.filesUserNameFileNameVersionGet(userName, fileName, version);
    }
}
