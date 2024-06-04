const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Formata as Tabelas com tamanho fixos para as colunas
function formatarParaTamanhoFixo(dados, larguras) {
  const linhasFormatadas = dados.map((linha) => {
    return linha.map((coluna, indice) => {
      const colunaString = coluna.toString();
      return colunaString.length > larguras[indice]
        ? colunaString.substring(0, larguras[indice]) // Caso string maior que tamanho da coluna, pegar apenas o ínicio
        : colunaString.padEnd(larguras[indice]); // Caso string menor que tamanho da coluna, adcionando espaços no fim
    });
  });

  return linhasFormatadas;
}

async function listarDadosBanco() {
  // Obtendo todos os modelos (tabelas) disponíveis no Prisma
  const modelos = Object.keys(prisma);

  // Iterando sobre os modelos para listar os dados
  for (const modelo of modelos) {
    // Apresentar apenas as tabelas do modeladas para o sistema
    if (/^[a-zA-Z]/.test(modelo)) {
      console.log(`== Tabela: ${modelo} ==`);
      try {
        // Consultando todos os registros na tabela atual
        const registros = await prisma[modelo].findMany();
        if (registros.length > 0) {
          // Exibindo cabeçalhos das colunas
          const cabecalhos = Object.keys(registros[0]);

          // Preparar dados para formatação
          const dadosParaFormatar = registros.map((registro) =>
            cabecalhos.map((coluna) => registro[coluna])
          );
          console.log(dadosParaFormatar);

          // Calcular larguras das colunas
          const larguras = cabecalhos.map((cabecalho) => cabecalho.length + 2);
          console.log(larguras);

          // Formatar e exibir os dados
          console.log(
            formatarParaTamanhoFixo(
              [cabecalhos, ...dadosParaFormatar],
              larguras
            )
              .map((linha) => linha.join(" | "))
              .join("\n")
          );
        } else {
          console.log("Nenhum dado encontrado.");
        }
      } catch (error) {
        console.error(`Erro ao acessar dados da tabela ${modelo}`);
      }
    }
  }

  // Fechando conexão com o banco de dados
  await prisma.$disconnect();
}

listarDadosBanco().catch((error) => {
  console.error("Erro ao listar dados do banco:", error);
});
