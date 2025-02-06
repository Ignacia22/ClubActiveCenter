import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Space } from 'src/Entities/Space.entity';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('allSpces')
  @SetMetadata('isPublic', true)
  @ApiOperation({summary: 'Obtener espacios.', description: 'Este endpoint trae todos los espacios, paginados.'})
  async getSpaces(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Space[]> {
    try {
      const pageNumber = page || 1;
      const limitNumber = limit || 5;
      return await this.spaceService.getAllSpace(pageNumber, limitNumber);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los espacios.',
        error.message || error,
      );
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Obtener un espacio id', description: 'Este endpoint recibe un id y se encarga de buscar el espacio.'})
  getSpaceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.spaceService.getSpaceById(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({summary: 'Obtener un espacio por nombre', description: 'Este endpoint se encarga de recibir un nombre y buscar un espacio.'})
  getSpaceByName(@Body() name: string) {
    return this.spaceService.getSpaceByName(name);
  }
}
