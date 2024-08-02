import { Knex } from "knex";

const TABLE_NAME = "likes";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("like_id").primary();

    table
      .bigInteger("post_id")
      .unsigned()
      .notNullable()
      .references("post_id")
      .inTable("posts")
      .onDelete("CASCADE");

    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamp("liked_at").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("updated_at").nullable();

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable("users")
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
