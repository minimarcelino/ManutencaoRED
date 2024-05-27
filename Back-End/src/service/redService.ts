import { red } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { StatusCodes } from 'http-status-codes';

export class redService {
  async findAll() {
    try {
      const [reds, length] = await Promise.all([
        prisma.red.findMany({
          include: {
            aluno: {
              include: {
                curso: true,
              },
            },
            pee: {
              include: {
                disciplinas: true,
                pee_servidor: true,
              },
            },
          },
        }),
        prisma.red.count({}),
      ]);

      const data = {
        reds,
        length,
      };
      return { ok: true, data: data };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }
  async create(red: any) {
    try {
      const createRed = await prisma.red.create({ data: red });
      return { ok: true, data: createRed, idRED: createRed.idRED };
    } catch (error) {
      console.log(error);
      // precisa retornar algum idRED para caso não consiga cadastrar
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR, idRED: -1 };
    }
  }

  async update(red: red, id: number) {
    try {
      const updateRed = await prisma.red.update({
        where: {
          idRED: id,
        },
        data: {
          dataInicioProcesso: red.dataInicioProcesso,
          dataPrevisaoTermino: red.dataPrevisaoTermino,
          motivoAfastamento: red.motivoAfastamento,
          situacao: red.situacao,
          observacao: red.observacao,
          inicioAfastamento: red.inicioAfastamento,
          tempoAfastamento: red.tempoAfastamento,
          semestreOuAnoAluno: red.semestreOuAnoAluno,
          coordenador: red.coordenador,
          aluno_id: red.aluno_id,
          motivoRecusa: red.motivoRecusa,
        },
      });
      return { ok: true, data: updateRed };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }


  async updateSituacao(req: any) {
    try {
      const updateRed = await prisma.red.update({
        where: {
          idRED: req.idRED,
        },
        data: {
          situacao: req.situacao,
        },
      });
      return { ok: true, data: updateRed };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async delete(id: number) {
    try {
      const deleteCurso = await prisma.red.delete({
        where: {
          idRED: id,
        },
      });
      return { ok: true, data: deleteCurso };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findFilesByRedId(id: number) {
    try {
      const files = await prisma.arquivo.findMany({
        where: {
          red_idRED: id,
        },
      });
      return { ok: true, data: files };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findById(id: number) {
    try {
      const curso = await prisma.red.findUnique({
        where: {
          idRED: +id,
        },
      });
      return { ok: true, data: curso };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }
}
