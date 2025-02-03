import { Body, Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Query, SetMetadata} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Space } from 'src/Entities/Space.entity';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('allSpces')
  @SetMetadata('isPublic', true)
  async getSpaces(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Space[]> {
    try {
      const pageNumber =page || 1;
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

  @Get(":id")
  @ApiBearerAuth()
  getSpaceById(@Param("id", ParseUUIDPipe) id:string){

    return this.spaceService.getSpaceById(id)

  }

  @Get()
  @ApiBearerAuth()
  getSpaceByName(@Body() name:string){

    return this.spaceService.getSpaceByName(name)

  }

  

 

  
}
