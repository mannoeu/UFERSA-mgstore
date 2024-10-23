const fastify = require("fastify")({ logger: true });
const knex = require("knex")(require("../knexfile").development);
const Apriori = require("node-apriori");

fastify.decorate("knex", knex);

fastify.get("/vendas", async (request, reply) => {
  const vendas = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
    .join("Dim_Produto", "Fato_Vendas.id_produto", "Dim_Produto.id_produto")
    .select(
      "Dim_Tempo.ano",
      "Dim_Produto.nome_produto",
      "Fato_Vendas.quantidade",
      "Fato_Vendas.valor_total"
    )
    .orderBy("Dim_Tempo.ano", "asc");

  const vendasPorAno = vendas.reduce((acc, venda) => {
    if (!acc[venda.ano]) {
      acc[venda.ano] = [];
    }
    acc[venda.ano].push({
      produto: venda.nome_produto,
      quantidade: venda.quantidade,
      valor: venda.valor_total,
    });
    return acc;
  }, {});

  reply.send(vendasPorAno);
});

fastify.get("/clientes", async (request, reply) => {
  const clientes = await fastify.knex("Dim_Cliente").select("*");

  reply.send(clientes);
});

fastify.get("/vendas/cliente/:id", async (request, reply) => {
  const { id } = request.params;
  const insightsCliente = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Cliente", "Fato_Vendas.id_cliente", "Dim_Cliente.id_cliente")
    .join("Dim_Produto", "Fato_Vendas.id_produto", "Dim_Produto.id_produto")
    .where("Dim_Cliente.id_cliente", id)
    .select(
      "Dim_Cliente.nome_cliente",
      fastify.knex.raw("COUNT(DISTINCT Fato_Vendas.id_venda) as total_compras"),
      fastify.knex.raw("SUM(Fato_Vendas.valor_total) as valor_total_gasto"),
      fastify.knex.raw(
        "GROUP_CONCAT(DISTINCT Dim_Produto.categoria) as categorias_compradas"
      )
    )
    .groupBy("Dim_Cliente.id_cliente", "Dim_Cliente.nome_cliente")
    .first();

  if (!insightsCliente) {
    reply
      .code(404)
      .send({ message: `Nenhum dado disponível para o cliente com ID ${id}` });
  } else {
    // Convertendo a string de categorias em um array
    insightsCliente.categorias_compradas =
      insightsCliente.categorias_compradas.split(",");
    reply.send(insightsCliente);
  }
});

fastify.get("/vendas/top-comprador/:ano", async (request, reply) => {
  const { ano } = request.params;

  // Obter o cliente que mais comprou no ano especificado
  const topComprador = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
    .join("Dim_Cliente", "Fato_Vendas.id_cliente", "Dim_Cliente.id_cliente")
    .where("Dim_Tempo.ano", ano)
    .select(
      "Dim_Cliente.id_cliente",
      "Dim_Cliente.avatar",
      "Dim_Cliente.nome_cliente",
      fastify.knex.raw("SUM(Fato_Vendas.valor_total) as valor_total_gasto")
    )
    .groupBy("Dim_Cliente.id_cliente", "Dim_Cliente.nome_cliente")
    .orderBy("valor_total_gasto", "desc")
    .first();

  if (!topComprador) {
    return reply
      .code(404)
      .send({ message: `Nenhum cliente encontrado para o ano de ${ano}` });
  }

  // Obter as categorias dos produtos comprados pelo top comprador
  const categoriasCompradas = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Produto", "Fato_Vendas.id_produto", "Dim_Produto.id_produto")
    .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
    .where("Dim_Tempo.ano", ano)
    .andWhere("Fato_Vendas.id_cliente", topComprador.id_cliente)
    .select(
      fastify.knex.raw(
        "GROUP_CONCAT(DISTINCT Dim_Produto.categoria) as categorias_compradas"
      )
    )
    .first();

  // Convertendo a string de categorias em um array
  topComprador.categorias_compradas =
    categoriasCompradas.categorias_compradas.split(",");

  // Retornando o resultado
  reply.send(topComprador);
});

fastify.get("/produtos", async (request, reply) => {
  const produtos = await fastify
    .knex("Dim_Produto")
    .select("id_produto", "nome_produto", "preco");

  reply.send(produtos);
});

fastify.get("/produtos/maior-saida/:ano", async (request, reply) => {
  const { ano } = request.params;
  const produtoCampeao = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
    .join("Dim_Produto", "Fato_Vendas.id_produto", "Dim_Produto.id_produto")
    .where("Dim_Tempo.ano", ano)
    .select("Dim_Produto.*")
    .sum("Fato_Vendas.quantidade as total_vendido")
    .groupBy("Dim_Produto.id_produto")
    .orderBy("total_vendido", "desc")
    .limit(5);

  if (!produtoCampeao) {
    reply
      .code(404)
      .send({ message: `Nenhum dado disponível para o ano ${ano}` });
  } else {
    reply.send(produtoCampeao);
  }
});

fastify.get("/produtos/menor-saida/:ano", async (request, reply) => {
  const { ano } = request.params;
  const produtoMenorSaida = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
    .join("Dim_Produto", "Fato_Vendas.id_produto", "Dim_Produto.id_produto")
    .where("Dim_Tempo.ano", ano)
    .select("Dim_Produto.*")
    .sum("Fato_Vendas.quantidade as total_vendido")
    .groupBy("Dim_Produto.id_produto")
    .orderBy("total_vendido", "asc")
    .limit(5);

  if (!produtoMenorSaida) {
    reply
      .code(404)
      .send({ message: `Nenhum dado disponível para o ano ${ano}` });
  } else {
    reply.send(produtoMenorSaida.reverse());
  }
});

fastify.get("/clientes-inativos/:ano", async (request, reply) => {
  const { ano } = request.params;
  const clientesInativos = await fastify
    .knex("Dim_Cliente")
    .whereNotIn("id_cliente", function () {
      this.select("Fato_Vendas.id_cliente")
        .from("Fato_Vendas")
        .join("Dim_Tempo", "Fato_Vendas.id_tempo", "Dim_Tempo.id_tempo")
        .where("Dim_Tempo.ano", ano);
    })
    .select("*");

  reply.send(clientesInativos);
});

fastify.get("/campanhas/resultado", async (request, reply) => {
  const resultadoCampanhas = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Campanha", "Fato_Vendas.id_campanha", "Dim_Campanha.id_campanha")
    .join("Dim_Canal", "Fato_Vendas.id_canal", "Dim_Canal.id_canal")
    .select(
      "Dim_Campanha.nome_campanha",
      "Dim_Canal.nome_canal",
      fastify.knex.raw(
        "COUNT(DISTINCT Fato_Vendas.id_cliente) as clientes_alcancados"
      ),
      fastify.knex.raw("SUM(Fato_Vendas.quantidade) as total_vendas"),
      fastify.knex.raw("SUM(Fato_Vendas.valor_total) as receita_total")
    )
    .groupBy("Dim_Campanha.nome_campanha")
    .orderBy("Dim_Campanha.id_campanha", "asc");

  reply.send(resultadoCampanhas);
});

fastify.get("/campanhas/resultado-por-canal", async (request, reply) => {
  const resultadoPorCanal = await fastify
    .knex("Fato_Vendas")
    .join("Dim_Canal", "Fato_Vendas.id_canal", "Dim_Canal.id_canal")
    .select(
      "Dim_Canal.id_canal",
      "Dim_Canal.nome_canal",
      fastify.knex.raw(
        "COUNT(DISTINCT Fato_Vendas.id_cliente) as total_clientes_alcancados"
      ),
      fastify.knex.raw("SUM(Fato_Vendas.valor_total) as total_receita")
    )
    .groupBy("Dim_Canal.id_canal", "Dim_Canal.nome_canal")
    .orderBy("total_receita", "desc");

  const resultado = resultadoPorCanal.reduce((acc, canal) => {
    acc.push({
      nome_canal: canal.nome_canal,
      total_clientes_alcancados: canal.total_clientes_alcancados,
      total_receita: canal.total_receita,
    });

    return acc;
  }, []);

  reply.send(resultado);
});

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

// Função para buscar perfil de clientes de um produto específico
async function getCustomerProfile(id_produto) {
  const clientes = await knex("Fato_Vendas")
    .join("Dim_Cliente", "Fato_Vendas.id_cliente", "Dim_Cliente.id_cliente")
    .where("Fato_Vendas.id_produto", id_produto)
    .select("Dim_Cliente.genero", "Dim_Cliente.idade");

  // Processar dados de perfil (calcular idades e agrupar por sexo)
  const perfil = clientes.reduce((acc, cliente) => {
    const genero = cliente.genero;

    if (!acc[genero]) {
      acc[genero] = { contador: 0, idade_soma: 0 };
    }

    acc[genero].contador += 1;
    acc[genero].idade_soma += cliente.idade;
    return acc;
  }, {});

  // Retornar a média de idade por sexo
  const resultado = Object.keys(perfil).map((genero) => ({
    genero,
    mediaIdade: perfil[genero].idade_soma / perfil[genero].contador,
    quantidade: perfil[genero].contador,
  }));

  return resultado;
}

fastify.get("/insights/customer-profile/:productId", async (request, reply) => {
  const { productId } = request.params;

  try {
    const perfil = await getCustomerProfile(productId);
    return reply.send({
      message: `Perfil dos clientes que compraram o produto ${productId}`,
      perfil,
    });
  } catch (error) {
    reply.status(500).send({ error: "Erro ao buscar perfil dos clientes" });
  }
});

fastify.listen({ port: 3333 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running at ${address}`);
});
