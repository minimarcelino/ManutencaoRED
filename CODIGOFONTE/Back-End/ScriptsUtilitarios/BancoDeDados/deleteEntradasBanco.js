const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteAllEntries() {
  try {
    await prisma.$connect();

    // Obter todos os modelos (tabelas) disponíveis no Prisma
    const modelos = Object.keys(prisma);

    // Excluir todas as entradas de todas as tabelas
    await Promise.all(
      modelos.map(async (modelo) => {
        try {
          // Verifica se o modelo tem o método deleteMany
          if (prisma[modelo].deleteMany) {
            await prisma[modelo].deleteMany({});
            console.log(
              `Todas as entradas da tabela ${modelo} foram deletadas.`
            );
          }
        } catch (error) {
          console.error(`Erro ao excluir entradas da tabela ${modelo}:`, error);
        }
      })
    );

    console.log("Todas as entradas das tabelas foram deletadas com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir as entradas das tabelas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chamar a função para excluir todas as entradas
deleteAllEntries();
