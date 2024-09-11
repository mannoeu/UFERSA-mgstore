/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Dim_Localizacao", (table) => {
    table.increments("id_localizacao").primary();
    table.string("cidade", 100);
    table.string("estado", 100);
    table.string("pais", 100);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Dim_Localizacao");
};
