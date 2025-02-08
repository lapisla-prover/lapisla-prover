import { Controller, Get, Query } from '@nestjs/common';
import { TimelineService } from '@/api/timeline.service';

@Controller('timeline')
export class TimelineController {
  constructor(private timelineService: TimelineService) {}

  @Get()
  async getTimeline(
    @Query('offset') offsetStr: string = '0',
    @Query('limit') limitStr: string = '10',
  ) {
    const offset = parseInt(offsetStr);
    const limit = parseInt(limitStr);
    return await this.timelineService.getTimeline(offset, limit);
  }
}
