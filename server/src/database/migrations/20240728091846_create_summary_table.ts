import { Knex } from "knex";

const TABLE_NAME = "summary";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("summary_id").primary(); // Primary key with auto-incrementing ID

    table.text("summary_text").notNullable(); // The actual summary text
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp("updated_at").nullable(); // Last updated timestamp

    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Foreign key to the users table
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
