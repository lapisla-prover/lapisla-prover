import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  Headers,
  Req,
  HttpException,
} from '@nestjs/common';
import { MeService } from '../api/me.service';
import { AbstractAuthService } from '../auth.service';
import { SourceCodeWrapper } from 'src/generated/openapi';
import { Request } from 'express';
import { Registration } from 'src/generated/openapi';

@Controller('me')
export class MeController {
  constructor(private meService: MeService) {}

  @Get('files')
  async getFiles(@Req() req: Request) {
    return await this.meService.getMyFiles(req.cookies['session_id']);
  }

  @Post('files/:fileName')
  async postFile(@Param('fileName') fileName: string, @Req() req: Request) {
    return await this.meService.createMyFile(
      fileName,
      req.cookies['session_id'],
    );
  }

  @Get('files/:fileName')
  async getFile(@Param('fileName') fileName: string, @Req() req: Request) {
    return await this.meService.getMyFile(fileName, req.cookies['session_id']);
  }

  @Delete('files/:fileName')
  async deleteFile(@Param('fileName') fileName: string, @Req() req: Request) {
    return await this.meService.deleteMyFile(
      fileName,
      req.cookies['session_id'],
    );
  }

  @Patch('files/:fileName')
  async patchFile(
    @Param('fileName') fileName: string,
    @Body() body: SourceCodeWrapper & {},
    @Req() req: Request,
  ) {
    return await this.meService.uploadMySnapshot(
      fileName,
      body,
      req.cookies['session_id'],
    );
  }

  @Patch('files/:fileName/:version')
  async updateTagsAndDescription(
    @Param('fileName') fileName: string,
    @Param('version') version: string,
    @Body() body: Registration & {},
    @Req() req: Request,
  ) {
    if (typeof body.description !== 'string') {
      throw new HttpException('description must be a string', 400);
    }
    if (!Array.isArray(body.tags)) {
      throw new HttpException('tags must be an array of strings', 400);
    }
    for (const tag of body.tags) {
      if (typeof tag !== 'string') {
        throw new HttpException('tags must be an array of strings', 400);
      }
    }
    return await this.meService.updateTagsAndDescription(
      fileName,
      version,
      body,
      req.cookies['session_id'],
    );
  }

  @Post('files/:fileName/:version/register')
  async registerSnapshot(
    @Param('fileName') fileName: string,
    @Param('version') version: string,
    @Req() req: Request,
    @Body() body: Registration & {},
  ) {
    let bodyIsOk = true;
    if (typeof body.description !== 'string') {
      bodyIsOk = false;
    }
    if (!Array.isArray(body.tags)) {
      bodyIsOk = false;
    }
    for (const tag of body.tags) {
      if (typeof tag !== 'string') {
        bodyIsOk = false;
      }
    }
    const ret = await this.meService.registerMySnapshot(
      fileName,
      version,
      req.cookies['session_id'],
    );
    if (bodyIsOk) {
      await this.meService.updateTagsAndDescription(
        fileName,
        version,
        body,
        req.cookies['session_id'],
      );
    }
    return ret;
  }

  @Get('files/:fileName/:version')
  async getSnapshot(
    @Param('fileName') fileName: string,
    @Param('version') version: string,
    @Req() req: Request,
  ) {
    return await this.meService.getMySnapshot(
      fileName,
      version,
      req.cookies['session_id'],
    );
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    return await this.meService.getMyUser(req.cookies['session_id']);
  }
}
