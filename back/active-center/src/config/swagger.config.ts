/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Activity } from 'src/Entities/Activity.entity';
import { Category } from 'src/Entities/Category.entity';
import { Order } from 'src/Entities/Order.entity';
import { Product } from 'src/Entities/Product.entity';
import { Reservation } from 'src/Entities/Reservation.entity';
import { Space } from 'src/Entities/Space.entity';
import { User } from 'src/Entities/User.entity';

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Club-Active-Center')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en el proyecto final ClubActiveCenter',
    )
    .setVersion('1.0.0')
    .addBearerAuth() // Soporte para autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [Activity, Category, Order, Product, Reservation, Space, User],
  });

  SwaggerModule.setup('api', app, document);
}
