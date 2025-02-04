import { BadRequestException, Controller, Get, Query, SetMetadata } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get()
  @SetMetadata('isPublic', true)
  async getActivities(@Query('page') page: number, @Query('limit') limit: number) {
    if(isNaN(page) || page <= 0) page = 1;
    if(isNaN(limit) || limit <= 0) limit = 10;
    return await this.activityService.getActivities(page, limit);
  }
}
