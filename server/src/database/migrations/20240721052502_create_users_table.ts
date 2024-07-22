import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements().primary();

    table.string("email", 255).unique().notNullable();
    table.string("password", 255).notNullable();
    table.string("name", 255).notNullable();
    table.string("profile_photo_url", 255).nullable();
    table.string("cover_photo_url", 255).nullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .bigInteger("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable(TABLE_NAME);

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
