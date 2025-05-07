import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/Category.entity';
import { Product } from 'src/Entities/Product.entity';
import { SubscriptionEntity } from 'src/Entities/Subscription.entity';
import { User } from 'src/Entities/User.entity';
import { Products } from 'src/Products';
import { subscriptionGold } from 'src/Subscription';
import { UserService } from 'src/User/user.service';
import { userMAin } from 'src/UserMain';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class SeeederDB {
  constructor(
    private readonly dataSource: DataSource,
    private userService: UserService,
  ) {}

  async seederDB() {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const existing: SubscriptionEntity | null = await queryRunner.manager.findOneBy(
        SubscriptionEntity,
        { name: subscriptionGold.name },
      );
      // Si no existe, crear una nueva instancia explícitamente
      if (!existing) {
        // Crear una nueva instancia de la entidad
        const newSubscription = new SubscriptionEntity();
        newSubscription.name = subscriptionGold.name;
        newSubscription.description = subscriptionGold.description;
        newSubscription.percentage = subscriptionGold.percentage;
        newSubscription.benefits = subscriptionGold.benefits;
        newSubscription.price = subscriptionGold.price;
        newSubscription.duration = subscriptionGold.duration;
        
        // Guardar la nueva instancia
        await queryRunner.manager.save(newSubscription);
      }
        //await queryRunner.manager.save(SubscriptionEntity, subscriptionGold);

      console.log('Suscripción cargada con exito.');

      const categories: string[] = Array.from(
        new Set(Products.map((product) => product.category)),
      );
      for (let category of categories) {
        const exist: null | Category = await queryRunner.manager.findOneBy(
          Category,
          { name: category },
        );
        if (!exist)
          await queryRunner.manager.save(Category, { name: category });
      }
      for (let product of Products) {
        const exist: Product | null = await queryRunner.manager.findOneBy(
          Product,
          { name: product.name },
        );
        if (!exist) {
          const category: Category | null = await queryRunner.manager.findOneBy(
            Category,
            { name: product.category },
          );
          if (category)
            await queryRunner.manager.save(Product, { ...product, category });
        }
      }
      console.log('Productos y categorias cargadas a la base de datos.');
      const exist: null | User = await this.userService.getUserByEmail(
        userMAin.email,
      );
      if (!exist) {
        userMAin.password = await this.userService.hashPassword(
          userMAin.password,
        );
        await queryRunner.manager.save(User, { ...userMAin });
      }
      await queryRunner.commitTransaction();
      console.log('Base de datos precargada.');
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al precargar la base de datos. ' +
          (error.detail || error.message, error),
      );
    } finally {
      await queryRunner.release();
      console.log('Fin del proceso de precarga.');
    }
  }
}
