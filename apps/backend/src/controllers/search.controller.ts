import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from '../api/search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async search(@Query('q') q: string) {
        return await this.searchService.searchSnapshots(q);
    }
}