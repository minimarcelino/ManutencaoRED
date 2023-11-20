const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Inserir um servidor
    await prisma.servidor.create({
      data: {
        email: 'admin@admin',
        tiposervidor: 'administrador',
        senha: 'admin',
        nome: 'Administrador',
        prontuario: 'PE0000000',
      },
    });

    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  } finally {
    // Fechar a conexão com o Prisma
    await prisma.$disconnect();
  }
}

// Chamar a função de semente
seedDatabase();
