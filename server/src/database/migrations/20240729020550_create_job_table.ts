import { Knex } from "knex";

const TABLE_NAME = "jobs_table";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("jobs_table_id").primary();

    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("title", 100).notNullable();
    table.text("description").notNullable();
    table.string("location", 100).notNullable();
    table.decimal("salary", 10, 2).nullable();
    table.string("employment_type", 50).notNullable();
    table.string("category_type", 50).notNullable();
    table.text("required_skills").nullable();
    table.string("experience_level", 50).nullable();
    table.timestamp("posted_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.date("application_deadline").nullable();
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
