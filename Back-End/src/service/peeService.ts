import { prisma } from '../../prisma/client';
import { StatusCodes } from 'http-status-codes';
import { pee } from '@prisma/client';

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
            pee_servidor: true,
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
      }
    });
    this.updateHashPEE(createPEE.idpee);

    return { ok: true, data: createPEE };
  } catch (error) {
    console.log(error);
    return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
  }
}


  // async createAtividade(atividade: atividades) {
  //   try {
  //     const createAtividade = await prisma.atividades.create({
  //       data: atividade,
  //     });
  //     return { ok: true, data: createAtividade };
  //   } catch (error) {
  //     console.log(error);
  //     return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
  //   }
  // }

  async update(pee: any, id: number) {


    if('editando' in pee){
      try {
        const professorsData = pee.pee_servidor.map((professor: any) => ({
          servidorId: professor.idservidor,
        }));
    
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
            prazoEntregaAtividade: pee.prazoEntregaAtividade
          },
        });
        return { ok: true, data: updatePEE };
      } catch (error) {
        console.log(error);
        return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    }else{
 

    try {
      const professorsData = pee.pee_servidor.map((professor: any) => ({
        servidorId: professor.idservidor,
      }));
  
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
              data: professorsData,
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
  
  

  // async updateAtividade(atividade: atividades, id: number) {
  //   try {
  //     const updateAtividade = await prisma.atividades.update({
  //       where: {
  //         idatividades_pee_idpee: {
  //           idatividades: +id,
  //           pee_idpee: atividade.pee_idpee,
  //         },
  //       },
  //       data: {
  //         descricao: atividade.descricao,
  //         prazoatividade: atividade.prazoatividade,
  //         pee_idpee: atividade.pee_idpee,
  //         dateEntregaAluno: atividade.dateEntregaAluno,
  //         cumpriuAtividade: atividade.cumpriuAtividade,
  //         novaAtividade: atividade.novaAtividade,
  //       },
  //     });
  //     return { ok: true, data: updateAtividade };
  //   } catch (error) {
  //     console.log(error);
  //     return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
  //   }
  // }

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

  // async deleteAtividade(id: number, peeId: number) {
  //   try {
  //     const deleteAtividade = await prisma.atividades.delete({
  //       where: {
  //         idatividades_pee_idpee: {
  //           idatividades: id,
  //           pee_idpee: peeId,
  //         },
  //       },
  //     });
  //     return { ok: true, data: deleteAtividade };
  //   } catch (error) {
  //     console.log(error);
  //     return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
  //   }
  // }

  async findByIdRED(id: number) {
    try {
      const [pees] = await Promise.all([
        prisma.pee.findMany({
          where: {
            RED_idRED: +id,
          },
          include: {
            disciplinas: true,
            pee_servidor: true,
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
