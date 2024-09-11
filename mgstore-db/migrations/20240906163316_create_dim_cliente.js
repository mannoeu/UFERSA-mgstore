/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Dim_Cliente", (table) => {
    table.increments("id_cliente").primary();
    table.string("nome_cliente", 100);
    table.string("email", 100);
    table.string("telefone", 20);
    table.string("avatar", 244);
    table.integer("idade");
    table.string("genero", 20);
    table
      .integer("id_localizacao")
      .unsigned()
      .references("id_localizacao")
      .inTable("Dim_Localizacao")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Dim_Cliente");
};
