import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/Category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Lo lamentamos hubo algún error al obtener las categorias.',
        error.message || error,
      );
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category: Category | null = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!category) throw new NotFoundException('Categoria no encontrada.');
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al obtener la categoria.',
        error.message || error,
      );
    }
  }

  async getCategoryByName(name: string): Promise<Category[]> {
    try {
      const category: Category[] = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect(`category.products`, 'products')
        .where(`category.name ILIKE :name`, { name: `%${name}%` })
        .getMany();
      if (!category.length)
        throw new NotFoundException(`No se encontro la categoria ${name}.`);
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al obtener la categoria.',
        error.message || error,
      );
    }
  }

  async createCategory(name: string): Promise<Category> {
    try {
      return await this.categoryRepository.save({ name });
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al crear la categoria.',
        error.message || error,
      );
    }
  }

  async deleteCategory(id: string): Promise<string> {
    try {
      const category: Category | null = await this.categoryRepository.findOneBy(
        { id },
      );
      if (!category)
        throw new NotFoundException('No se encontro la categoría.');
      await this.categoryRepository.delete(category);
      return 'Se elimino la categoría.';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al eliminar la categoría.',
        error.message || error,
      );
    }
  }

  async editCategory(id: string, name: string): Promise<string> {
    try {
      const oldCategory: Category | null =
        await this.categoryRepository.findOneBy({ id });
      if (!oldCategory)
        throw new NotFoundException('No se encontro la categoría.');
      await this.categoryRepository.save({ ...oldCategory, name });
      return 'Se edito la categoría.';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al editar la categoría.',
        error.message || error,
      );
    }
  }
}
