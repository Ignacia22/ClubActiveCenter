/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config0 } from './config/config.envs';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors();
  app.use(auth(config0));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(`Server is listen on the port ${process.env.PORT}`),
  );
}
bootstrap();
