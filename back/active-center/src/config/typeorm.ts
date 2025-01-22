/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConfig } from './config.envs';
import { Product } from 'src/Entities/Product.entity';
import { Category } from 'src/Entities/Category.entity';

dotenvConfig({ path: `.env` });

const config = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  dropSchema: dbConfig.dropSchema,
  entities: ['./dist/**/*.entity{.js, .ts}'],
  migrations: dbConfig.migration,  
};


export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);