import knex, { Knex } from 'knex';
import knexConfig from '../../../knexfile';

class DatabaseHelper {
  knex: Knex;

  getTable<T>(tableName: string) {
    if (!this.knex) {
      this.knex = knex(knexConfig);
    }

    return this.knex<T>(tableName);
  }
}

export const databaseHelper = new DatabaseHelper();
