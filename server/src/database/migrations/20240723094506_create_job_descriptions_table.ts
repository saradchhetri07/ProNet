import { Knex } from "knex";

const TABLE_NAME = "job_descriptions";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("job_description_id").primary();
    table
      .bigInteger("job_id")
      .unsigned()
      .notNullable()
      .references("job_id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table.text("description").notNullable();
    table.text("requirements").nullable();
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
