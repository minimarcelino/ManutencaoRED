import { red } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { StatusCodes } from 'http-status-codes';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const unlinkAsync = promisify(fs.unlink);

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
                disciplinas: {
                  include: {
                    curso: true,
                  },
                },
                pee_servidor: {
                  include: {
                    servidor: true,
                  },
                },
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

  async deleteFile(idFile: number) {
    try {
      // Encontrar o arquivo no banco de dados usando Prisma
      const file = await prisma.arquivo.findUnique({
        where: { idArquivo: idFile }
      });

      if (!file) {
        return { ok: false, message: 'Arquivo não encontrado', status: StatusCodes.NOT_FOUND };
      }

      // Excluir o arquivo do sistema de arquivos
      const filePath = path.join(__dirname, '..', '..', 'uploads', file.path);
      await unlinkAsync(filePath);

      // Excluir a entrada do banco de dados usando Prisma
      await prisma.arquivo.delete({
        where: { idArquivo: idFile }
      });

      return { ok: true, message: 'Arquivo excluído com sucesso', status: StatusCodes.OK };
    } catch (error) {
      console.log(error);
      return { ok: false, message: 'Erro ao excluir o arquivo', status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

}
