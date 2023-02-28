/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("google_responses", (table) => {
      table.increments("id"); //Primary key
      table.float("response_time").notNullable();
    })
    .createTable("facebook_responses", (table) => {
      table.increments("id"); //Primary key
      table.float("response_time").notNullable();
    })
    .createTable("twitter_responses", (table) => {
      table.increments("id"); //Primary key
      table.float("response_time").notNullable();
    })
    .createTable("cnet_responses", (table) => {
      table.increments("id"); //Primary key
      table.float("response_time").notNullable();
    })
    .createTable("amazon_responses", (table) => {
      table.increments("id"); //Primary key
      table.float("response_time").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("google_responses")
    .dropTable("facebook_responses")
    .dropTable("twitter_responses")
    .dropTable("cnet_responses")
    .dropTable("amazon_responses");
};
