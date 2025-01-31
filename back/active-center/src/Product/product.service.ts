import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    private categoryRepository: Repository<Category>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { category, stock, ...productData } = createProductDto;
      let categoryExist = await this.categoryRepository.findOne({
        where: { name: category },
      });
      if (!categoryExist) {
        categoryExist = this.categoryRepository.create({ name: category });
        await this.categoryRepository.save(categoryExist);
      }
      const product: Product | null = await this.productsRepository.findOneBy({
        name: productData.name,
      });
      if (product)
        return await this.productsRepository.save({
          ...product,
          stock: product.stock + stock,
        });
      return await this.productsRepository.save({
        ...createProductDto,
        category: categoryExist,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al agregar el producto.',
        error.message || error.detail || error,
      );
    }
  }

  async getProduct(page: number, limit: number) {
    try {
      const products = await this.productsRepository.find({
        relations: ['category'],
      });
      const start = (+page - 1) * +limit;
      const end = start + +limit;
      return products.slice(start, end);
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al obtener los productos.',
      );
    }
  }

  async getProductById(id: string) {
    try {
      return await this.productsRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al obtener el producto.',
        error.message || error,
      );
    }
  }

  async updateProductById(id: string, product: Partial<Product>) {
    try {
      const oldProduct = await this.productsRepository.findOneBy({ id });
      if (!oldProduct) {
        return null;
      }
      const updatedProduct = { ...oldProduct, ...product };
      await this.productsRepository.save(updatedProduct);
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se puedo actualizar el producto.',
        error.message || error,
      );
    }
  }

  async isRetired(id: string) {
    try {
      const product: Product | null = await this.productsRepository.findOneBy({
        id,
      });
      if (!product) throw new NotFoundException('No existe el producto.');

      if (product.productStatus === StatusProduct.Available) {
        await this.productsRepository.save({
          ...product,
          productStatus: StatusProduct.Retired,
        });
        return {
          product: {id},
          message: 'Se retiro el producto.'
        };
      } else if (product.productStatus === StatusProduct.Retired) {
        await this.productsRepository.save({
          ...product,
          productStatus: StatusProduct.Available,
        });
        return {
          product: {id},
          message: 'Se habilito el producto.'
        };
      } else if (
        product.productStatus === StatusProduct.Retired &&
        product.stock === 0
      ) {
        await this.productsRepository.save({
          ...product,
          productStatus: StatusProduct.OutOfStock,
        });
        return {
          product: {id},
          message: 'Se habilito el producto pero no hay en stock.'
        };
      }
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error al intentar hacer la petición.', error.message || error);
    };
  }
}
