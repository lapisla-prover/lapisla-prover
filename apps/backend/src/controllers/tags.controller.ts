import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from 'src/api/tags.service';


@Controller('tags')
export class TagsController {
    constructor(private timelineService: TagsService) {}

    @Get()
    async getTags() {
        return await this.timelineService.getTags();
    }
}
