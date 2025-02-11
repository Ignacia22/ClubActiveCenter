import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { Category } from 'src/Entities/Category.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { CategoryDTO } from './CategoryDTO/Category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description:
      'Devuelve una lista con todas las categorías disponibles en la base de datos.',
  })
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }

  @Get('search')
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Buscar categorías por nombre',
    description:
      'Permite realizar una búsqueda parcial de categorías según su nombre.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Nombre de la categoría a buscar',
  })
  async getCategoryByName(@Query('name') name: string): Promise<Category[]> {
    return await this.categoryService.getCategoryByName(name);
  }

  @Get(':id')
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description:
      'Devuelve los detalles de una categoría específica según su ID.',
  })
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.getCategoryById(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Crear una nueva categoría. (ADMIN)',
    description:
      'Crea una nueva categoría en la base de datos con el nombre proporcionado.',
  })
  async createCategory(@Body() category: CategoryDTO): Promise<Category> {
    return await this.categoryService.createCategory(category.name);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Eliminar una categoría por ID. (ADMIN)',
    description: 'Elimina una categoría de la base de datos según su ID.',
  })
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    return await this.categoryService.deleteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Editar una categoría por ID. (ADMIN)',
    description:
      'Modifica el nombre de una categoría específica en la base de datos.',
  })
  async editCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() category: CategoryDTO,
  ): Promise<string> {
    return await this.categoryService.editCategory(id, category.name);
  }
}
