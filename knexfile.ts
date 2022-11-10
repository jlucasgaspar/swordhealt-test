import { Knex } from 'knex';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('provide correct DATABASE_URL env');
}

const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: false,
};

export default knexConfig;
