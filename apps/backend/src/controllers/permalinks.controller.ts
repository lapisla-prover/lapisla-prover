import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermalinksService } from '../api/permalinks.service';

@Controller('permalinks')
export class PermalinksController {
    constructor(private permalinksService: PermalinksService) {}

    @Get(':permalinkId')
    async getPermalink(@Param('permalinkId') permalinkId: string) {
        return await this.permalinksService.getPermalink(permalinkId);
    }
}