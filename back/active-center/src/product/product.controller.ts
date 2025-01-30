import { Body, Controller, Get, Post, Query, SetMetadata } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, pagedProducts } from './productsDTO/createProduct.dto';
import { Product } from 'src/Entities/Product.entity';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productsService: ProductService
    ){}

    @Get()
    @SetMetadata('isPublic', true)
    async getProducts(
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 5
    ): Promise<pagedProducts>{
        return await this.productsService.getProducts(page, limit)
    }
    
    @Post('agregarProducto')
    async createProduct(
        @Body()newProduct: CreateProductDTO
    ): Promise<Product | null>{
        return await this.productsService.CreateProduct(newProduct)
    }

}
