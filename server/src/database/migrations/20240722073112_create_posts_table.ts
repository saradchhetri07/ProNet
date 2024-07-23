import { Knex } from "knex";

const TABLE_NAME = "posts";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("post_id").primary();

    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.text("content").notNullable();

    table.string("privacy", 20).notNullable().defaultTo("public");

    table.boolean("edited").defaultTo(false);

    table
      .bigInteger("original_post_id")
      .unsigned()
      .nullable()
      .references("post_id")
      .inTable(TABLE_NAME)
      .onDelete("CASCADE");

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").defaultTo(knex.fn.now());
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
