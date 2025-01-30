import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/Entities/Category.entity';
import { Product } from 'src/Entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
