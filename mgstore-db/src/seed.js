const knex = require("knex")(require("../knexfile").development);
const { fakerPT_BR: faker } = require("@faker-js/faker");

async function seedDimTempo() {
  await knex("Dim_Tempo").del();
  for (let i = 0; i < 365; i++) {
    await knex("Dim_Tempo").insert({
      ano: faker.number.int({ min: 2020, max: 2024 }),
      mes: faker.date.month(),
      dia: faker.number.int({ min: 1, max: 31 }),
    });
  }
}

async function seedDimProduto() {
  await knex("Dim_Produto").del();
  for (let i = 0; i < 50; i++) {
    await knex("Dim_Produto").insert({
      nome_produto: faker.commerce.productName(),
      categoria: faker.commerce.department(),
      marca: faker.company.name(),
      preco: faker.commerce.price(),
    });
  }
}

async function seedDimLocalizacao() {
  await knex("Dim_Localizacao").del();
  for (let i = 0; i < 100; i++) {
    await knex("Dim_Localizacao").insert({
      cidade: faker.location.city(),
      estado: faker.location.state(),
      pais: faker.location.country(),
    });
  }
}

async function seedDimCliente() {
  await knex("Dim_Cliente").del();
  const localizacoes = await knex("Dim_Localizacao").select("id_localizacao");

  for (let i = 0; i < 100; i++) {
    await knex("Dim_Cliente").insert({
      nome_cliente: faker.person.fullName(),
      avatar: faker.image.url(),
      email: faker.internet.email(),
      telefone: faker.phone.number({ style: "national" }),
      idade: faker.number.int({ min: 18, max: 80 }),
      genero: faker.helpers.arrayElement(["Masculino", "Feminino", "Outro"]),
      id_localizacao: faker.helpers.arrayElement(localizacoes).id_localizacao,
    });
  }
}

async function seedDimCanal() {
  await knex("Dim_Canal").del();
  const canais = ["Online", "Loja Física", "Revendedor", "Telemarketing"];
  for (let i = 0; i < canais.length; i++) {
    await knex("Dim_Canal").insert({
      nome_canal: canais[i],
    });
  }
}

async function seedDimCampanha() {
  await knex("Dim_Campanha").del();
  for (let i = 0; i < 20; i++) {
    await knex("Dim_Campanha").insert({
      nome_campanha: `Campanha ${i + 1}`,
    });
  }
}

async function seedFatoVendas() {
  await knex("Fato_Vendas").del();
  const produtos = await knex("Dim_Produto").select("id_produto");
  const clientes = await knex("Dim_Cliente").select("id_cliente");
  const localizacoes = await knex("Dim_Localizacao").select("id_localizacao");
  const tempos = await knex("Dim_Tempo").select("id_tempo");
  const canais = await knex("Dim_Canal").select("id_canal");
  const campanhas = await knex("Dim_Campanha").select("id_campanha");

  for (let i = 0; i < 1000; i++) {
    await knex("Fato_Vendas").insert({
      id_tempo: faker.helpers.arrayElement(tempos).id_tempo,
      id_produto: faker.helpers.arrayElement(produtos).id_produto,
      id_cliente: faker.helpers.arrayElement(clientes).id_cliente,
      id_localizacao: faker.helpers.arrayElement(localizacoes).id_localizacao,
      id_canal: faker.helpers.arrayElement(canais).id_canal,
      id_campanha: faker.helpers.arrayElement(campanhas).id_campanha,
      quantidade: faker.number.int({ min: 1, max: 10 }),
      valor_total: faker.commerce.price(),
    });
  }
}

async function seedDatabase() {
  try {
    await seedDimTempo();
    await seedDimProduto();
    await seedDimLocalizacao();
    await seedDimCliente();
    await seedDimCanal();
    await seedDimCampanha();
    await seedFatoVendas();
    console.log("Dados fictícios inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados fictícios:", error);
  } finally {
    knex.destroy();
  }
}

seedDatabase();
