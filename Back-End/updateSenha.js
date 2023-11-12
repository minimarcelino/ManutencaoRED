const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePasswords() {
  // Busque todos os servidores
  const servidores = await prisma.servidor.findMany();

  for (const servidor of servidores) {
    // Gere o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(servidor.senha.trim(), salt);

    // Atualize a senha do servidor no banco de dados
await prisma.servidor.update({
    where: { idservidor: servidor.idservidor },
    data: { senha: senhaHash },
  });
  }

  console.log('Senhas atualizadas com sucesso');
}

updatePasswords().catch(e => {
  console.error(e);
  process.exit(1);
});