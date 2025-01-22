import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermalinksService } from '../generated/openapi';

@Controller('permalinks')
export class PermalinksController {
    constructor(private permalinksService: PermalinksService) {}

    @Get(':permalinkId')
    getPermalink(@Param('permalinkId') permalinkId: string) {
        return this.permalinksService.getPermalink(permalinkId);
    }
}