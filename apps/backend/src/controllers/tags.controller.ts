import { Controller, Get } from '@nestjs/common';
import { TagsService } from '@/api/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private timelineService: TagsService) {}

  @Get()
  async getTags() {
    return await this.timelineService.getTags();
  }
}
