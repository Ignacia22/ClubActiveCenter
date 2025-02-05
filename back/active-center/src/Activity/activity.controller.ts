import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from 'src/Entities/Activity.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { ActivitiesPageDTO, ActivityResponseDTO, CreateActivityDTO } from './activitiesDTO/Activity.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get()
  @SetMetadata('isPublic', true)
  @ApiOperation({ summary: 'Obtener actividades con paginación', description: 'Este endpoint, permite traer todas las actividades con un formato, de paginación.'})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página para la paginación' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de actividades por página' })
  async getActivities(@Query('page') page: number, @Query('limit') limit: number): Promise<ActivitiesPageDTO> {
    if(isNaN(page) || page <= 0) page = 1;
    if(isNaN(limit) || limit <= 0) limit = 10;
    return await this.activityService.getActivities(page, limit);
  }

  @Get(':id')
  @SetMetadata('isPublic', true)
  @ApiOperation({ summary: 'Obtener una Actividad por id', description: 'Este endpoint, permite traer una actividad por su id.'})
  async getAvtivityById(@Param('id', ParseUUIDPipe) id: string): Promise<ActivityResponseDTO> {
    return await this.activityService.getActivityById(id);
  };

  @Post('createActivity')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear actividades', description: 'Este endpoint, permite crear una actividad con cualquier usuario administrador.'})
  async createActivity(@Body() data: CreateActivityDTO): Promise<ActivityResponseDTO> {
    return await this.activityService.createActivity(data);
  };

  @Put('toggle-registration/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrase o cancelar registro', description: 'Este endpoint, permite registrar a un usuario, a una actividad, y en caso de que ya lo este, permite al usuario cancelar su registro.'})
  async togglereGistration (@Req() req: any, @Param('id', ParseUUIDPipe) id: string): Promise<string> {
    const email: string = req.access.email;
    console.log(email);
    return await this.activityService.registerActivity(email, id)
  }

  @Delete('delete-activity/:id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Borrar actividades', description: 'Este endpoint, permite borrar una actividad con cualquier usuario administrador.'})
  async cancelActivity(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.activityService.cancelActivity(id);
  }
}
