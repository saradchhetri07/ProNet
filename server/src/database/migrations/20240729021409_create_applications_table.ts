import { Knex } from "knex";

const TABLE_NAME = "applications";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("application_id").primary();

    table
      .bigInteger("job_id")
      .unsigned()
      .notNullable()
      .references("job_id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.text("cover_letter").nullable();
    table.string("resume_url", 255).nullable();
    table.string("status", 50).notNullable().defaultTo("Applied"); // Possible values: Applied, Interviewed, Rejected, etc.

    table.timestamp("applied_at").notNullable().defaultTo(knex.fn.now());
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
