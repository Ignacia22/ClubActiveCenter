import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: `.env` });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}` || 'localhost',
  port: process.env.DB_PORT,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [],
  migrations: [],
  autoLoadEntities: true,
  logging: true,
  synchronize: true
};


export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);