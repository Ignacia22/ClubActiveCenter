/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConfig } from './config.envs';
import { Logger } from '@nestjs/common';

const logger = new Logger('TypeOrmConfig');

// Configuración que usa la URL si está disponible o los parámetros individuales si no
let config: DataSourceOptions;

if (dbConfig.useUrl && dbConfig.url) {
  logger.log('Usando DATABASE_URL para la conexión a la base de datos');
  
  config = {
    type: 'postgres',
    url: dbConfig.url,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    dropSchema: dbConfig.dropSchema,
    entities: dbConfig.entities,
    migrations: dbConfig.migration,
    ssl: dbConfig.ssl,
  } as DataSourceOptions;
} else {
  logger.log('Usando configuración de base de datos tradicional');
  
  config = {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    dropSchema: dbConfig.dropSchema,
    entities: dbConfig.entities,
    migrations: dbConfig.migration,
  } as DataSourceOptions;
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);