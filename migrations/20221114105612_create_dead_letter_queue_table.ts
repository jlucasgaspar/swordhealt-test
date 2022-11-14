import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'dead_letter_queue',
    (table: Knex.TableBuilder) => {
      table.bigIncrements().primary();
      table.string('kafka_message').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('dead_letter_queue');
}
