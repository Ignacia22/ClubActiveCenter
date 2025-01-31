import { Body, Controller, Get, Param, ParseUUIDPipe, SetMetadata} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

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
