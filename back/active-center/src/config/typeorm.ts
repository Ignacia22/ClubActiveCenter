/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: `.env` });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [],
  autoLoadEntities: process.env.DB_AUTOLOAD_ENTITIES,
  logging: process.env.DB_LOGGING,
  synchronize: process.env.DB_SYNCHRONIZE,
  dropSchema: process.env.DB_DROP_SCHEMA
};


export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);