import knex, { Knex } from 'knex';
import knexConfig from '../../../knexfile';

class DatabaseHelper {
  private database: Knex;

  getTable<T>(tableName: string) {
    if (!this.database) {
      this.database = knex(knexConfig);
    }

    return this.database<T>(tableName);
  }
}

export const databaseHelper = new DatabaseHelper();
