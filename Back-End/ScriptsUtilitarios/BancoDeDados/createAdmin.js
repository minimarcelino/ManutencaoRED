const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function createAdministrador() {
  const prisma = new PrismaClient();
  const salt = await bcrypt.genSalt(10);
  const servidor = {
    email: "gerenciared.ifsp+adm1@gmail.com",
    tiposervidor: "administrador",
    senha: "123",
    nome: "Grande Administrador",
    prontuario: "PE0000000",
  };
  const senhaHash = await bcrypt.hash(servidor.senha.trim(), salt);
  servidor.senha = senhaHash;
  try {
    await prisma.servidor.create({
      data: {
        email: servidor.email,
        tiposervidor: servidor.tiposervidor,
        senha: servidor.senha,
        nome: servidor.nome,
        prontuario: servidor.prontuario,
      },
    });
    console.log(`Dados do servidor ${servidor.nome} inseridos com sucesso!`);
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdministrador();