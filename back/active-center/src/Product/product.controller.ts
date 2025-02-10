import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/Entities/Product.entity';
import { CreateProductDto, ProductFilters } from './productDTO/product.dto';
import { ProductService } from './product.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
@SetMetadata('isPublic', true)
@ApiOperation({ summary: 'Obtener productos con filtros y paginación', description: 'Este endpoint permite obtener productos con paginación y filtros opcionales.' })
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página para la paginación' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de productos por página' })
@ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrar productos por nombre' })
@ApiQuery({ name: 'category', required: false, type: String, description: 'Filtrar productos por categoría' })
@ApiQuery({ name: 'stock', required: false, type: Number, description: 'Filtrar productos por stock disponible' })
@ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Filtrar productos por precio mínimo' })
@ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Filtrar productos por precio máximo' })
async getProduct(
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Query('name') name?: string,
  @Query('category') category?: string,
  @Query('stock') stock?: number,
  @Query('minPrice') minPrice?: number,
  @Query('maxPrice') maxPrice?: number,
) {
  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 5;

    const filters: ProductFilters = { name, category, stock, minPrice, maxPrice };

    return await this.productService.getProduct(pageNumber, limitNumber, filters);
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Error al obtener los productos.', error.message || error);
  }
}

@Post('create')
@Roles(Role.admin)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Crear un nuevo producto. (ADMIN)', description: 'Este endpoint permite a los administradores crear un nuevo producto.' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Nombre del producto' , example: 'camisa'},
      description: { type: 'string', description: 'Descripción del producto', example: 'camisa toda chula'},
      price: { type: 'number', description: 'Precio del producto', example: 200},
      stock: { type: 'number', description: 'Cantidad disponible en stock', example: 1},
      category: { type: 'string', description: 'Categoría del producto', example: 'Camisa' },
      file: { type: 'string', format: 'binary', description: 'Imagen del producto (JPG, PNG, WEBP, máximo 1.5MB)' },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async createProduct(
  @Body() product: CreateProductDto,
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
  return this.productService.createProduct(product, file);
}

@Get(':id')
@SetMetadata('isPublic', true)
@ApiOperation({ summary: 'Obtener un producto por ID', description: 'Este endpoint obtiene un producto específico a partir de su ID.' })
async getProductById(@Param('id', ParseUUIDPipe) id: string) {
  try {
    const product = await this.productService.getProductById(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Error al obtener el producto.', error.message || error);
  }
}

@Put(':id')
@Roles(Role.admin)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Actualizar un producto. (ADMIN)', description: 'Este endpoint permite a los administradores actualizar un producto existente.' })
async updateProductById(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() product: Product,
) {
  try {
    const updatedProduct = await this.productService.updateProductById(id, product);
    if (!updatedProduct) throw new NotFoundException('Producto no encontrado');
    return updatedProduct;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Error al actualizar el producto.', error.message || error);
  }
}

@Delete(':id')
@Roles(Role.admin)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Eliminar (retirar) un producto. (ADMIN)', description: 'Este endpoint permite a los administradores retirar un producto del catálogo, en caso que ya lo este devolverlo a la tienda, y si no tiene stock al momento de devolverlo a la tienda el estado sera sin stock.' })
async isRetired(@Param('id', ParseUUIDPipe) id: string) {
  return await this.productService.isRetired(id);
}

}
