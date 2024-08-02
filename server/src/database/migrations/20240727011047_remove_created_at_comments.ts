import { Knex } from "knex";

const TABLE_NAME = "comments";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn("created_by");
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("comments", function (table) {
    table
      .bigInteger("created_by")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
  });
}
