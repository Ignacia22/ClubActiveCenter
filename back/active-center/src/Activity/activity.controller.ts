import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import {
  ActivitiesPageDTO,
  ActivityResponseDTO,
  CreateActivityDTO,
} from './activitiesDTO/Activity.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubscriptiondGuard } from 'src/Auth/Guard/subscriptionguard.guard';
import { subscriptions } from 'src/decorators/subscriptions.decorator';
import { Subscriptions } from 'src/Subscription/SubscriptionDTO/Subscription.enum';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get()
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Obtener actividades con paginación',
    description:
      'Este endpoint, permite traer todas las actividades con un formato, de paginación.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para la paginación',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de actividades por página',
  })
  async getActivities(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ActivitiesPageDTO> {
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;
    return await this.activityService.getActivities(page, limit);
  }

  @Get(':id')
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Obtener una Actividad por id',
    description: 'Este endpoint, permite traer una actividad por su id.',
  })
  async getAvtivityById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ActivityResponseDTO> {
    return await this.activityService.getActivityById(id);
  }

  @Post('createActivity')
  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título de la actividad',
          example: 'Clase de Yoga Matutina',
        },
        maxPeople: {
          type: 'number',
          description:
            'Número máximo de personas que pueden participar en la actividad',
          example: 20,
        },
        date: {
          type: 'string',
          format: 'date',
          description: 'Fecha en la que se realizará la actividad',
          example: '2025-02-10',
        },
        hour: {
          type: 'string',
          pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
          description: 'Hora en la cual se va a realizar la actividad',
          example: '14:30',
        },
        description: {
          type: 'string',
          description: 'Descripción de la actividad',
          example: 'Clase de yoga para principiantes en el parque central.',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen de la actividad (JPG, PNG, WEBP, máximo 1.5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Crear actividades. (ADMIN)',
    description:
      'Este endpoint, permite crear una actividad con cualquier usuario administrador.',
  })
  async createActivity(
    @Body() data: CreateActivityDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1500000,
            message: 'El tamaño máximo es 1.5 MB',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ActivityResponseDTO> {
    return await this.activityService.createActivity(data, file);
  }

  @Put('toggle-registration/:id')
  @subscriptions(Subscriptions.GOLD)
  @UseGuards(SubscriptiondGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registrase o cancelar registro',
    description:
      'Este endpoint, permite registrar a un usuario, a una actividad, y en caso de que ya lo este, permite al usuario cancelar su registro.',
  })
  async toggleRegistration(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    const email: string = req.access.email;
    return await this.activityService.registerActivity(email, id);
  }

  @Delete('delete-activity/:id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Borrar actividades. (ADMIN)',
    description:
      'Este endpoint, permite borrar una actividad con cualquier usuario administrador.',
  })
  async cancelActivity(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    return await this.activityService.cancelActivity(id);
  }
}
