import { prisma } from '../../prisma/client';
import { StatusCodes } from 'http-status-codes';
import { pee } from '@prisma/client';
import { emailController } from '../controller/emailController';

const emailcontroller = new emailController();
export class peeService {
  async findMany(
    search: string,
    page: number,
    perPage: number,
    orderBy: string
  ) {
    try {
      let skip: number = (Number(page) - 1) * Number(perPage);
      const [pees, length] = await Promise.all([
        prisma.pee.findMany({
          where: {
            conteudo: {
              contains: String(search),
            },
          },
          take: Number(perPage),
          skip: skip,
          //@ts-ignore
          orderBy: {
            conteudo: String(orderBy),
          },
        }),
        prisma.pee.count({
          where: {
            conteudo: {
              contains: String(search),
            },
          },
        }),
      ]);

      const data = {
        pees,
        length,
      };
      return { ok: true, data: data };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findAll() {
    try {
      const [pees, length] = await Promise.all([
        prisma.pee.findMany({
          include: {
            red: {
              include: {
                aluno: true,
              },
            },
            pee_servidor: {
              include: {
                servidor: true,
              },
            },
            disciplinas: {
              include: {
                curso: true,
              },
            },
          },
          orderBy: {
            red: {
              dataInicioProcesso: 'desc',
            },
          },
        }),
        prisma.pee.count({}),
      ]);

      const data = {
        pees,
        length,
      };
      return { ok: true, data: data };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findById(id: number) {
    try {
      const [pees] = await Promise.all([
        prisma.pee.findUnique({
          where: {
            idpee: +id,
          },
          include: {
            // servidor: true,
          },
        }),
      ]);

      const data = {
        pees,
      };
      return { ok: true, data: data };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async create(pee: pee) {
    try {
      const createPEE = await prisma.pee.create({
        data: {
          conteudo: pee.conteudo,
          metodologia: pee.metodologia,
          trabalhos: pee.trabalhos,
          bibliografia: pee.bibliografia,
          criterios: pee.criterios,
          prazofinal: pee.prazofinal,
          RED_idRED: pee.RED_idRED,
          disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
          //pee_servidor: pee.pee_servidor,
          percentualabono: pee.percentualabono,
          situacao: pee.situacao,
          canalComunicacao: pee.canalComunicacao,
          observacoes: pee.observacoes,
          dataEnvioProposta: pee.dataEnvioProposta,
          hash: pee.hash,
          avaliacaoAtividade: pee.avaliacaoAtividade,
          prazoEntregaAtividade: pee.prazoEntregaAtividade,
          dataEntregaAtividade: pee.dataEntregaAtividade,
          cumpriuAtividade: pee.cumpriuAtividade,
          houveAvaliacao: pee.houveAvaliacao,
          avaliacoesRealizadas: pee.avaliacoesRealizadas,
          dataAvaliacao: pee.dataAvaliacao,
        },
      });
      this.updateHashPEE(createPEE.idpee);

      return { ok: true, data: createPEE };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async update(pee: any, id: number) {
    if ('editando' in pee) {
      try {
        const updatePEE = await prisma.pee.update({
          where: {
            idpee: id,
          },
          data: {
            conteudo: pee.conteudo,
            metodologia: pee.metodologia,
            trabalhos: pee.trabalhos,
            bibliografia: pee.bibliografia,
            criterios: pee.criterios,
            prazofinal: pee.prazofinal,
            RED_idRED: pee.RED_idRED,
            percentualabono: pee.percentualabono,
            dataEnvioProposta: pee.dataEnvioProposta,
            canalComunicacao: pee.canalComunicacao,
            houveAvaliacao: pee.houveAvaliacao,
            avaliacoesRealizadas: pee.avaliacoesRealizadas,
            dataAvaliacao: pee.dataAvaliacao,
            observacoes: pee.observacoes,
            situacao: pee.situacao,
            cumpriuAtividade: pee.cumpriuAtividade,
            dataEntregaAtividade: pee.dataEntregaAtividade,
            prazoEntregaAtividade: pee.prazoEntregaAtividade,
            avaliacaoAtividade: pee.avaliacaoAtividade,
          },
        });
        return { ok: true, data: updatePEE };
      } catch (error) {
        console.log(error);
        return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    } else {
      try {
        // Obter todos os IDs de servidores associados com o ID específico de pee
        const servidoresAssociados = await prisma.pee_servidor.findMany({
          where: {
            pee: {
              idpee: id,
            },
          },
          select: {
            servidorId: true,
          },
        });

        // Extrair os IDs dos servidores associados
        const idsServidoresAssociados = servidoresAssociados.map(
          (associacao) => associacao.servidorId
        );
        // Filtrar os servidores que não estão na lista de servidores associados
        const professoresData = pee.pee_servidor
          .filter(
            (professor: any) =>
              !idsServidoresAssociados.includes(professor.idservidor)
          )
          .map((professor: any) => ({
            servidorId: professor.idservidor,
          }));

        // Verificar associações a serem removidas
        const idsRemover: number[] = idsServidoresAssociados.filter(
          (servidorId) =>
            !pee.pee_servidor.some(
              (professor: any) => professor.idservidor === servidorId
            )
        );
                  // Envio de e-mail para os servidores sendo removidos
          for (const servidorId of idsRemover) {
            const servidor = await prisma.servidor.findUnique({
              where: { idservidor: servidorId },
              select: { email: true },
            });

            if (servidor) {
              await emailcontroller.SendEmailProfessorDesassociadoPEE(pee.idpee, servidor.email);
            }
          }

        // Remover associações não desejadas
        if (idsRemover.length > 0) {
          await prisma.pee_servidor.deleteMany({
            where: {
              peeId: pee.id,
              servidorId: {
                in: idsRemover,
              },
            },
          });
        }
        const updatePEE = await prisma.pee.update({
          where: {
            idpee: id,
          },
          data: {
            conteudo: pee.conteudo,
            metodologia: pee.metodologia,
            trabalhos: pee.trabalhos,
            bibliografia: pee.bibliografia,
            criterios: pee.criterios,
            prazofinal: pee.prazofinal,
            RED_idRED: pee.RED_idRED,
            percentualabono: pee.percentualabono,
            dataEnvioProposta: pee.dataEnvioProposta,
            canalComunicacao: pee.canalComunicacao,
            houveAvaliacao: pee.houveAvaliacao,
            avaliacoesRealizadas: pee.avaliacoesRealizadas,
            dataAvaliacao: pee.dataAvaliacao,
            observacoes: pee.observacoes,
            situacao: pee.situacao,
            cumpriuAtividade: pee.cumpriuAtividade,
            dataEntregaAtividade: pee.dataEntregaAtividade,
            prazoEntregaAtividade: pee.prazoEntregaAtividade,
            pee_servidor: {
              createMany: {
                data: professoresData,
              },
            },
          },
        });
        return { ok: true, data: updatePEE };
      } catch (error) {
        console.log(error);
        return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    }
  }

  async delete(id: number) {
    try {
      const deletePEE = await prisma.pee.delete({
        where: {
          idpee: id,
        },
      });
      return { ok: true, data: deletePEE };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findByIdRED(id: number) {
    try {
      const [pees] = await Promise.all([
        prisma.pee.findMany({
          where: {
            RED_idRED: +id,
          },
          include: {
            pee_servidor: {
              include: {
                servidor: true,
              },
            },
            disciplinas: {
              include: {
                curso: true,
              },
            },
          },
        }),
      ]);

      const data = {
        pees,
      };
      return { ok: true, data: data };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async findByHash(hash: string) {
    try {
      const peeData = await prisma.pee.findFirst({
        where: {
          hash: hash,
        },
        include: {
          disciplinas: true,
          red: {
            include: {
              aluno: true,
            },
          },
        } as any,
      });

      if (peeData) {
        return { ok: true, data: peeData };
      } else {
        return { ok: false, data: StatusCodes.NOT_FOUND };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }

  async updateHashPEE(id: number) {
    try {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256');
      hash.update(id.toString());
      const hashPEE = hash.digest('hex');
      const updatePEE = await prisma.pee.update({
        where: {
          idpee: id,
        },
        data: {
          hash: hashPEE,
        } as any,
      });
      return { ok: true, data: updatePEE };
    } catch (error) {
      console.log(error);
      return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  }
}
