/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  setupSwagger(app);
  app.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(`Server is listen on the port ${process.env.PORT}`),
  );
}
bootstrap();
