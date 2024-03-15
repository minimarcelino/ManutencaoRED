const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function backupData() {
  try {
    await prisma.$connect();

    // Obtendo todos os modelos (tabelas) disponíveis no Prisma
    const modelos = Object.keys(prisma);

    // Objeto para armazenar os dados de todas as tabelas
    const allData = {};

    // Iterando sobre os modelos para fazer backup dos dados
    for (const modelo of modelos) {
      if (/^[a-zA-Z]/.test(modelo)) {
        console.log(`== Backup da Tabela: ${modelo} ==`);
        try {
          // Consultando todos os registros na tabela atual
          const records = await prisma[modelo].findMany();
          allData[modelo] = records;
          console.log(`Backup da tabela ${modelo} realizado com sucesso.`);
        } catch (error) {
          console.error(`Erro ao acessar dados da tabela ${modelo}:`, error);
        }
      }
    }

    // Salva os dados em um arquivo JSON
    const backupFilePath = path.join(__dirname, "backup.json");
    fs.writeFileSync(backupFilePath, JSON.stringify(allData, null, 2));

    console.log("Backup dos dados realizado com sucesso:", backupFilePath);
  } catch (error) {
    console.error("Erro ao fazer o backup dos dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chamar a função para fazer o backup dos dados
backupData().catch((error) => {
  console.error("Erro ao fazer backup dos dados:", error);
});
