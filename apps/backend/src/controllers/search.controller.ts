import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from '../api/search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async search(@Query('q') q: string, @Query('before') before: string, @Query('offset') offset: number, @Query('limit') limit: number) {
        return await this.searchService.searchSnapshots(q, offset, limit, before);
    }
}