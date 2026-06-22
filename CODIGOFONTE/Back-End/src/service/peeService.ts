import { prisma } from '../../prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { emailController } from '../controller/emailController';

type PeeCreate = Prisma.peeCreateInput & {
  RED_idRED: number;

  disciplinas_iddisciplinas: number;

  pee_servidor?: {
    idservidor: number;
  }[];
};

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

  async create(pee: PeeCreate) {
    try {

      const createPEE = await prisma.pee.create({

        data: {

          conteudo: pee.conteudo,

          metodologia: pee.metodologia,

          trabalhos: pee.trabalhos,

          bibliografia: pee.bibliografia,

          criterios: pee.criterios,

          prazofinal: pee.prazofinal,

          red: {
            connect: {
              idRED: pee.RED_idRED
            }
          },

          disciplinas: {
            connect: {
              iddisciplinas: pee.disciplinas_iddisciplinas
            }
          },

          percentualabono:
            pee.percentualabono,

          situacao:
            pee.situacao,

          canalComunicacao:
            pee.canalComunicacao,

          observacoes:
            pee.observacoes,

          dataEnvioProposta:
            pee.dataEnvioProposta,

          hash:
            pee.hash,

          avaliacaoAtividade:
            pee.avaliacaoAtividade,

          prazoEntregaAtividade:
            pee.prazoEntregaAtividade,

          dataEntregaAtividade:
            pee.dataEntregaAtividade,

          cumpriuAtividade:
            pee.cumpriuAtividade,

          houveAvaliacao:
            pee.houveAvaliacao,

          avaliacoesRealizadas:
            pee.avaliacoesRealizadas,

          dataAvaliacao:
            pee.dataAvaliacao,


          pee_servidor: pee.pee_servidor

        },


        include: {

          pee_servidor: {

            include: {

              servidor: true

            }

          }

        }

      });


      await this.updateHashPEE(createPEE.idpee);


      return {

        ok: true,

        data: createPEE

      };


    } catch (error) {

      console.log(error);

      return {

        ok: false,

        data: StatusCodes.INTERNAL_SERVER_ERROR

      };

    }
  }


  async update(pee: any, id: number) {

    console.log(
      "JSON RECEBIDO:",
      JSON.stringify(pee, null, 2)
    );

    console.log("========== DADOS UPDATE ==========");
    console.log("ID:", id);
    console.log("RED:", pee.RED_idRED);
    console.log("DISCIPLINA:", pee.disciplinas_iddisciplinas);
    console.log("PERCENTUAL:", pee.percentualabono);
    console.log("BODY COMPLETO:", pee);
    console.log(
  "CAMPOS DE ACOMPANHAMENTO:",
  {
    dataEnvioProposta: pee.dataEnvioProposta,
    dataEntregaAtividade: pee.dataEntregaAtividade,
    cumpriuAtividade: pee.cumpriuAtividade,
    houveAvaliacao: pee.houveAvaliacao,
    avaliacoesRealizadas: pee.avaliacoesRealizadas,
    dataAvaliacao: pee.dataAvaliacao
  }
);
    try {

      console.log('========== UPDATE PEE ==========');
      console.log('ID:', id);
      console.log('BODY RECEBIDO:', pee);

      console.log("SITUAÇÃO RECEBIDA:", pee.situacao);
      console.log("HOUVE AVALIAÇÃO:", pee.houveAvaliacao);


      const servidoresAssociados = await prisma.pee_servidor.findMany({
        where: {
          peeId: id,
        },
        select: {
          servidorId: true,
        },
      });


      const idsServidoresAssociados = servidoresAssociados.map(
        (associacao) => associacao.servidorId
      );


      const servidoresRecebidos = pee.pee_servidor || [];


      const professoresData = servidoresRecebidos
        .filter(
          (professor: any) =>
            !idsServidoresAssociados.includes(professor.idservidor)
        )
        .map(
          (professor: any) => ({

            servidorId:
              professor.idservidor ??
              professor.servidor?.idservidor

          })
        )
        .filter(
          (professor: any) => professor.servidorId
        );


      const idsRemover = idsServidoresAssociados.filter(
        (servidorId) =>
          !servidoresRecebidos.some(
            (professor: any) =>
              professor.idservidor === servidorId
          )
      );


      if (idsRemover.length > 0) {

        await prisma.pee_servidor.deleteMany({
          where: {
            peeId: id,

            servidorId: {
              in: idsRemover,
            },
          },
        });

      }

      console.log("DADOS ENVIADOS PARA O PRISMA:");
      console.log({
        conteudo: pee.conteudo,
        metodologia: pee.metodologia,
        trabalhos: pee.trabalhos,
        situacao: pee.situacao,
        avaliacoesRealizadas: pee.avaliacoesRealizadas,
        dataAvaliacao: pee.dataAvaliacao
      });
      const updatePEE = await prisma.pee.update({

where:{
 idpee:id
},

data:{


conteudo: pee.conteudo ?? undefined,

metodologia: pee.metodologia ?? undefined,

trabalhos: pee.trabalhos ?? undefined,


situacao: pee.situacao ?? undefined,


pee_servidor:{
 create: professoresData
}


},

include:{
 pee_servidor:true
}

});


      console.log(
        "UPDATE FINALIZADO:",
        updatePEE
      );


      return {

        ok: true,

        data: updatePEE,

      };


    } catch (error: any) {

      console.log("ERRO COMPLETO UPDATE:", error);

      return {
        ok: false,
        data: error
      };

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
