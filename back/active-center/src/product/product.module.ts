import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/Entities/item.entity';
import { Product } from 'src/Entities/Product.entity';
import { Category } from 'src/Entities/Category.entity';

@Module({
  imports:[
    CloudinaryModule,
    TypeOrmModule.forFeature([Item, Product, Category])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
