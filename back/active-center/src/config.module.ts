/* eslint-disable prettier/prettier */
import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const configService = config.get('typeorm');
        if(!configService) throw new InternalServerErrorException('No esta bien configurado el typeorm.')
          return configService;
      },

    }),
  ],
})
export class configModule {} 
