import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/Category.entity';
import { Product } from 'src/Entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, StatusProduct } from './productDTO/product.dto';

@Injectable()
export class ProductService {
    constructor(
      @InjectRepository(Product) private productsRepository: Repository<Product>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,){}

      async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const { category, stock, ...productData } = createProductDto;
    
        let categoryEntity = await this.categoryRepository.findOne({ where: { name: category } });
    
        if (!categoryEntity) {
            categoryEntity = this.categoryRepository.create({ name: category });
            await this.categoryRepository.save(categoryEntity);
        }
    
        const productState = stock === 0 ? StatusProduct.OutOfStock : StatusProduct.Available;
    
        const newProduct = this.productsRepository.create({
            ...productData,
            stock,
            category: categoryEntity,
            productStatus: productState, 
        });
    
        return await this.productsRepository.save(newProduct);
    }
    

    async getProduct(page: number, limit: number) {
    const products = await this.productsRepository.find();

    const start = (+page - 1) * +limit;
    const end = start + +limit;
    return products.slice(start, end);
  }
    async getProductById(id: string) {
    return await this.productsRepository.findOneBy({ id });
  }

    async updateProductById(id: string, product: Partial<Product>) {
    const oldProduct = await this.productsRepository.findOneBy({ id });
  
    if (!oldProduct) {
      return null;
    }
    const updatedProduct = { ...oldProduct, ...product };
  
    await this.productsRepository.save(updatedProduct);
  
    return updatedProduct;
  }
  
}
