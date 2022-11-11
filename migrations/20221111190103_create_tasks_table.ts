import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tasks', (table: Knex.TableBuilder) => {
    table.bigIncrements().primary();
    table
      .bigInteger('userId')
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .notNullable();
    table.string('summary', 2500).notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('finishedAt').nullable();
    table.timestamp('updatedAt').nullable();
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tasks');
}
