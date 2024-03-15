const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function restoreData() {
  try {
    await prisma.$connect();

    // Caminho do arquivo de backup
    const arquivoBackup = path.join(__dirname, "backup.json");

    // Lê os dados do arquivo de backup
    const backupData = JSON.parse(fs.readFileSync(arquivoBackup, "utf-8"));

    // Itera sobre os dados e insere-os de volta no banco de dados
    for (const modelo in backupData) {
      console.log(`== Restaurando dados para a tabela: ${modelo} ==`);
      try {
        await prisma[modelo].createMany({ data: backupData[modelo] }); // Insere os dados de volta
        console.log(`Dados restaurados para a tabela ${modelo} com sucesso.`);
      } catch (error) {
        console.error(
          `Erro ao restaurar dados para a tabela ${modelo}:`,
          error
        );
      }
    }

    console.log("Restauração dos dados concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao restaurar os dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chamar a função para restaurar os dados
restoreData().catch((error) => {
  console.error("Erro ao restaurar os dados:", error);
});
