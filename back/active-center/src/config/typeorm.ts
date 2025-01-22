/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConfig } from './config.envs';

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
  entities: dbConfig.entities,
  migrations: dbConfig.migration,  
};


export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);