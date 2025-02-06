import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Space } from 'src/Entities/Space.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSpaceDto } from './dto/create-space.dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('allSpaces')
  @SetMetadata('isPublic', true)
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

  @Post('create')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imagen del producto',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createSpaces(
    @Body() spaces: CreateSpaceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000, message: 'El tamaño máximo es 1.5 MB' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      })
    ) 
    file?: Express.Multer.File,
  ) {
    return this.spaceService.createSpaces(spaces, file);
  }  

  @Get(':id')
  @ApiBearerAuth()
  getSpaceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.spaceService.getSpaceById(id);
  }

  @Get()
  @ApiBearerAuth()
  getSpaceByName(@Body() name: string) {
    return this.spaceService.getSpaceByName(name);
  }
}
