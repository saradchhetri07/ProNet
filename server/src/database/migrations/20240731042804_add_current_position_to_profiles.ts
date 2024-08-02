import { Knex } from "knex";

const TABLE_NAME = "profiles";

/**
 * Add the current_position column to the profiles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.string("current_position", 255).nullable();
  });
}

/**
 * Remove the current_position column from the profiles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn("current_position");
  });
}
