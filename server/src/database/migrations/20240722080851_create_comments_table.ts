import { Knex } from "knex";

const TABLE_NAME = "comments";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("comment_id").primary();

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

    table.text("content").notNullable();

    table
      .bigInteger("parent_comment_id")
      .unsigned()
      .nullable()
      .references("comment_id")
      .inTable(TABLE_NAME)
      .onDelete("CASCADE");

    table.timestamp("comment_date").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table
      .bigInteger("created_by")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");

    table.timestamp("updated_at").nullable();
    table
      .bigInteger("updated_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users");
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
