/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Dim_tempo", (table) => {
    table.increments("id_tempo").primary();
    table.integer("ano");
    table.integer("mes");
    table.integer("dia");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Dim_tempo");
};
