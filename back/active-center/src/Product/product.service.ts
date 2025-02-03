import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/Category.entity';
import { Product } from 'src/Entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, ProductFilters, StatusProduct } from './productDTO/product.dto';

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

  async getProduct(page: number, limit: number, filters?: ProductFilters) {
    try {
      const query = this.productsRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category');
  
      if (filters?.stock) {
        query.andWhere('product.stock = :stock', { stock: filters.stock });
      }

      if (filters?.category) {
        query.andWhere('category.name = :category', { category: filters.category });
      }
      if (filters?.minPrice) {
        query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters?.maxPrice) {
        query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      if (filters?.name) {
        query.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
      }
  
      const products = await query.getMany();
  
      const start = (+page - 1) * +limit;
      const end = start + +limit;
      return products.slice(start, end);
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error al obtener los productos.');
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

      let newStatus: StatusProduct;
      let message: string;
  
      if (product.productStatus === StatusProduct.Available) {
        newStatus = StatusProduct.Retired;
        message = 'Se retiró el producto.';
      } else if (product.productStatus === StatusProduct.Retired) {
        if (product.stock === 0) {
          newStatus = StatusProduct.OutOfStock;
          message = 'El producto fue retirado y no hay stock.';
        } else {
          newStatus = StatusProduct.Available;
          message = 'Se habilitó el producto.';
        }
      } else {
        throw new BadRequestException('El estado del producto no permite esta acción.');
      }
  
      await this.productsRepository.save({ ...product, productStatus: newStatus });
  
      return {
        product: { id },
        message,
      };
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error al intentar hacer la petición.', error.message || error);
    };
  }
}
