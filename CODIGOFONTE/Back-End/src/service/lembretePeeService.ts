import { prisma } from "../../prisma/client";
import { emailController } from "../controller/emailController";

const emailcontroller = new emailController();

export class lembretePeeService {

  async verificarLembretes() {

  try {

    const professores = await prisma.pee_servidor.findMany({

      where: {
        dataAvaliacao: null
      },

      include: {

        servidor: true,

        pee: {

          include: {

            red: {
              include: {
                aluno: true
              }
            },

            disciplinas: true

          }

        }

      }

    });

    // <-- O FOR ENTRA AQUI
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    for (const registro of professores) {

      const termino = new Date(
        registro.pee.red.dataPrevisaoTermino
      );

      termino.setHours(0, 0, 0, 0);

      const dias = Math.floor(
  (termino.getTime() - hoje.getTime()) /
  (1000 * 60 * 60 * 24)
);

      console.log({
  professor: registro.servidor.nome,
  disciplina: registro.pee.disciplinas.nomeDisciplina,
  termino: registro.pee.red.dataPrevisaoTermino,
  hoje: hoje,
  dias: dias
});

      if (
  dias === 30 ||
  dias === 25 ||
  dias === 20
) {
  await emailcontroller.SendEmailLembretePEE(registro);
}
        {

        //console.log(`Enviar lembrete para ${registro.servidor.nome}`);

        await emailcontroller.SendEmailLembretePEE(registro);
      }

    }

  } catch (error) {

    console.log(error);

  }

}

}