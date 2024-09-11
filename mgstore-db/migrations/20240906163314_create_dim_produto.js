/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Dim_Produto", (table) => {
    table.increments("id_produto").primary();
    table.string("nome_produto", 100);
    table.string("categoria", 50);
    table.string("marca", 50);
    table.decimal("preco", 10, 2);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Dim_Produto");
};
