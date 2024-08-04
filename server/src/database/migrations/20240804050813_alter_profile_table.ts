import { Knex } from "knex";

const TABLE_NAME = "table_name";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("profiles", (table) => {
    table.string("experience", 255).nullable();
    table.string("current_company", 255).nullable();
  });
}
/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("profiles", (table) => {
    table.dropColumn("experience");
    table.dropColumn("current_company");
  });
}
