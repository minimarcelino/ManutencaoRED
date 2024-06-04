const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seedDatabase(servidores) {
  const salt = await bcrypt.genSalt(10);

  // Encriptar a senha
  for (const servidor of servidores) {
    const senhaHash = await bcrypt.hash(servidor.senha.trim(), salt);
    servidor.senha = senhaHash;
  }

  // Inserção de cada servidor no Banco de Dados
  try {
    for (const cadastrar of servidores) {
      await prisma.servidor.create({
        data: {
          email: cadastrar.email,
          tiposervidor: cadastrar.tiposervidor,
          senha: cadastrar.senha,
          nome: cadastrar.nome,
          prontuario: cadastrar.prontuario,
        },
      });
      console.log(`Dados do servidor ${cadastrar.nome} inseridos com sucesso!`);
    }
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    // Fechar a conexão com o Prisma
    await prisma.$disconnect();
  }
}

let servidores = [
  {
    email: "gerenciared.ifsp+adm1@gmail.com",
    tiposervidor: "administrador",
    senha: "123",
    nome: "Grande Administrador",
    prontuario: "PE0000000",
  },
  {
    email: "gerenciared.ifsp+adm2@gmail.com",
    tiposervidor: "administrador",
    senha: "123",
    nome: "Administrador 1",
    prontuario: "PE0000001",
  },
  {
    email: "gerenciared.ifsp+profa@gmail.com",
    tiposervidor: "professor",
    senha: "123",
    nome: "Professor A",
    prontuario: "PE1000000",
  },
  {
    email: "gerenciared.ifsp+profb@gmail.com",
    tiposervidor: "professor",
    senha: "123",
    nome: "Professor B",
    prontuario: "PE1000001",
  },
  {
    email: "gerenciared.ifsp+coorbcc@gmail.com",
    tiposervidor: "coordenador",
    senha: "123",
    nome: "Coordenador BCC",
    prontuario: "PE2000000",
  },
  {
    email: "gerenciared.ifsp+coorbee@gmail.com",
    tiposervidor: "coordenador",
    senha: "123",
    nome: "Coordenador BEE",
    prontuario: "PE2000001",
  },
  {
    email: "gerenciared.ifsp+cra1@gmail.com",
    tiposervidor: "cra",
    senha: "123",
    nome: "CRA Chefia",
    prontuario: "PE3000000",
  },
  {
    email: "gerenciared.ifsp+cra2@gmail.com",
    tiposervidor: "cra",
    senha: "123",
    nome: "CRA Subordinado",
    prontuario: "PE3000001",
  },
  {
    email: "gerenciared.ifsp+csp1@gmail.com",
    tiposervidor: "csp",
    senha: "123",
    nome: "CSP Chefia",
    prontuario: "PE4000000",
  },
  {
    email: "gerenciared.ifsp+csp2@gmail.com",
    tiposervidor: "csp",
    senha: "123",
    nome: "CSP Subordinado",
    prontuario: "PE4000001",
  },
];

// Chamada da função de seed
seedDatabase(servidores);
