/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Club-Active-Center')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en el proyecto final ClubActiveCenter',
    )
    .setVersion('1.0.0')
    .addBearerAuth() // Soporte para autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);
}
