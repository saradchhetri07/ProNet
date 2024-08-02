import { Knex } from "knex";

const TABLE_NAME = "job_tag_association";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table
      .bigInteger("job_id")
      .unsigned()
      .notNullable()
      .references("job_id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table
      .bigInteger("tag_id")
      .unsigned()
      .notNullable()
      .references("tag_id")
      .inTable("job_tags")
      .onDelete("CASCADE");
    table.primary(["job_id", "tag_id"]);
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
