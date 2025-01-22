import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from '../generated/openapi';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    search(@Query('q') q: string) {
        return this.searchService.searchSnapshots(q);
    }
}