import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from 'src/Entities/Activity.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { CreateActivityDTO } from './activitiesDTO/Activity.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Get(':id')
  @SetMetadata('isPublic', true)
  async getAvtivityById(@Param('id', ParseUUIDPipe) id: string): Promise<Activity> {
    return await this.activityService.getActivityById(id);
  };

  @Post('createActivity')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async createActivity(@Body() data: CreateActivityDTO): Promise<Activity> {
    return await this.activityService.createActivity(data);
  };

  @Put('toggle-registration/:id')
  @ApiBearerAuth()
  async togglereGistration (@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const email: string = req.access.email;
    console.log(email);
    
    return await this.activityService.registerActivity(email, id)
  }
}
