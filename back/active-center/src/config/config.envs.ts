/* eslint-disable prettier/prettier */
import 'dotenv/config';

const data = process.env;

const DB_TYPE: any = data.DB_TYPE ?? 'postgres';
const DB_HOST: string | undefined = data.DB_HOST;
const DB_PORT: number | undefined = data.DB_PORT
  ? parseInt(data.DB_PORT, 10)
  : 5432;
const DB_USERNAME: string | undefined = data.DB_USERNAME;
const DB_PASSWORD: string | undefined = data.DB_PASSWORD;
const DB_NAME: string | undefined = data.DB_NAME;
const DB_SYNCHRONIZE: boolean | undefined = data.DB_SYNCHRONIZE
  ? data.DB_SYNCHRONIZE === 'true'
  : true;
const DB_LOGGING: boolean | undefined = data.DB_LOGGING
  ? data.DB_LOGGING === 'true'
  : true;
const DB_ENTITIES: string[] | undefined = data.DB_ENTITIES
  ? !data.DB_ENTITIES.includes(', .')
    ? data.DB_ENTITIES.split(',').map((path) => path.trim())
    : [data.DB_ENTITIES.trim()]
  : ['./dist/**/*.entity{.ts, .js}'];
const DB_DROPSCHEMA: boolean | undefined = data.DB_DROP_SCHEMA
  ? data.DB_DROP_SCHEMA === 'true'
  : false;
const DB_MIGRATION: string[] | undefined = data.DB_MIGRATION
  ? !data.DB_MIGRATION.includes(', .')
    ? data.DB_MIGRATION.split(',').map((path) => path.trim())
    : [data.DB_MIGRATION.trim()]
  : ['./dist/**/*.migration{.ts, .js}'];

export const dbConfig = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: DB_SYNCHRONIZE,
  logging: DB_LOGGING,
  entities: DB_ENTITIES,
  dropSchema: DB_DROPSCHEMA,
  migration: DB_MIGRATION,
};

export const SALT: number = data.SALT ? parseInt(data.SALT, 10) : 10;
export const SECRET_SECRET_WORD: string | undefined = data.SECRET_WORD;

const AUTHREQUIRED: boolean = Boolean(data.AUTHREQUIRED);
const AUTH0LOGOUT: boolean = Boolean(data.AUTH0LOGOUT);
const SECRET: string | undefined = data.SECRET;
const BASEURL: string | undefined = data.BASEURL;
const CLIENTID: string | undefined = data.CLIENTID;
const ISSUERBASEURL: string | undefined = data.ISSUERBASEURL;

export const config0 = {
  authRequired: AUTHREQUIRED,
  auth0Logout: AUTH0LOGOUT,
  secret: SECRET,
  baseURL: BASEURL,
  clientID: CLIENTID,
  issuerBaseURL: ISSUERBASEURL,
};
