import { Controller, Get, Param } from '@nestjs/common';
import { FilesService } from '@/api/files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(':userName')
  async getFiles(@Param('userName') userName: string) {
    return await this.filesService.getPublicFiles(userName);
  }

  @Get(':userName/:fileName')
  async getFile(
    @Param('userName') userName: string,
    @Param('fileName') fileName: string,
  ) {
    return await this.filesService.getPublicFile(userName, fileName);
  }

  @Get(':userName/:fileName/:version')
  async getFileVersion(
    @Param('userName') userName: string,
    @Param('fileName') fileName: string,
    @Param('version') version: string,
  ) {
    return await this.filesService.getPublicSnapshot(
      userName,
      fileName,
      version,
    );
  }
}
