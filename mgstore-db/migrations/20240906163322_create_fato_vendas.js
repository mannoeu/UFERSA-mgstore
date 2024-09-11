/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Fato_Vendas", (table) => {
    table.increments("id_venda").primary();
    table
      .integer("id_tempo")
      .unsigned()
      .references("id_tempo")
      .inTable("Dim_Tempo");
    table
      .integer("id_produto")
      .unsigned()
      .references("id_produto")
      .inTable("Dim_Produto");
    table
      .integer("id_cliente")
      .unsigned()
      .references("id_cliente")
      .inTable("Dim_Cliente");
    table
      .integer("id_localizacao")
      .unsigned()
      .references("id_localizacao")
      .inTable("Dim_Localizacao");
    table
      .integer("id_canal")
      .unsigned()
      .references("id_canal")
      .inTable("Dim_Canal");
    table
      .integer("id_campanha")
      .unsigned()
      .references("id_campanha")
      .inTable("Dim_Campanha");
    table.integer("quantidade");
    table.decimal("valor_total", 10, 2);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Fato_Vendas");
};
