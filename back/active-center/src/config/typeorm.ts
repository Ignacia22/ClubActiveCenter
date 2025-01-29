/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConfig } from './config.envs';

const config: DataSourceOptions = {
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
<<<<<<< HEAD
  ssl: {
    rejectUnauthorized: true,
  },
=======
  // ssl: {
  //   rejectUnauthorized: false,
  // },
>>>>>>> 9142c48 (Implemented Stripe, Moduls , RElations to Order, Entities)
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
