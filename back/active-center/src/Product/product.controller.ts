import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Product } from 'src/Entities/Product.entity';
import { CreateProductDto } from './productDTO/product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProduct(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      if (page && limit) {
        return await this.productService.getProduct(page, limit);
      }
      return await this.productService.getProduct(1, 5);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener productos');
    }
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productService.createProduct(createProductDto);
      return product; 
    } catch (error) {
      console.error(error); 
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el producto');
    }
  }



  @Put(':id')
  async updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: Product,
  ) {
    try {
      const updatedProduct = await this.productService.updateProductById(
        id,
        product,
      );
      if (!updatedProduct) {
        throw new NotFoundException('Producto no encontrado');
      }
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }
  }
