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

function converterData(data: string) {

  if (!data) return undefined;


  if (data.includes('/')) {

    const [dia, mes, ano] = data.split('/');

    return new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia)
    );

  }


  return new Date(data);

}

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

  async findByProfessor(idservidor: number) {
    try {

      //console.log("BUSCANDO PROFESSOR:", idservidor);


      const relacoes = await prisma.pee_servidor.findMany({
        where: {
          servidorId: idservidor
        },
        include: {
          pee: true,
          servidor: true
        }
      });


      //console.log("RELAÇÕES:", relacoes);


      const todos = await prisma.pee_servidor.findMany({
        include: {
          servidor: true,
          pee: true
        }
      });
      //console.log(todos);

      //console.log("TODAS RELAÇÕES PEE_SERVIDOR:", todos);


      const pees = await prisma.pee.findMany({
        where: {
          pee_servidor: {
            some: {
              servidorId: idservidor
            }
          }
        },
        include: {
          red: {
            include: {
              aluno: true
            }
          },
          disciplinas: true,
          pee_servidor: {
            include: {
              servidor: true
            }
          }
        }
      });


      //("PEES ENCONTRADOS:", pees);


      return {
        ok: true,
        data: { pees }
      };


    } catch (error: any) {

      console.log(error);

      return {
        ok: false,
        data: StatusCodes.INTERNAL_SERVER_ERROR
      };

    }
  }


  async findById(id: number) {
    try {

      const pees = await prisma.pee.findUnique({

        where: {
          idpee: +id,
        },

        include: {

          pee_servidor: {
            include: {
              servidor: true
            }
          },

          red: {
            include: {
              aluno: true
            }
          },

          disciplinas: {
            include: {
              curso: true
            }
          }

        },

      });


      const data = {
        pees,
      };


      return {
        ok: true,
        data: data
      };


    } catch (error) {

      console.log(error);

      return {
        ok: false,
        data: StatusCodes.INTERNAL_SERVER_ERROR
      };

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
            pee.situacao ?? "Aguardando Docente",

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
    try {
// Busca situação atual antes da alteração
const peeAnterior = await prisma.pee.findUnique({
  where: {
    idpee: id
  }
});



// Busca servidores já associados
const servidoresAssociados = await prisma.pee_servidor.findMany({
  where: {
    peeId: id,
  },
  select: {
    servidorId: true,
  },
});


const idsServidoresAssociados =
  servidoresAssociados.map(
    servidor => servidor.servidorId
  );



const servidoresRecebidos =
  pee.pee_servidor !== undefined
    ? pee.pee_servidor
    : null;



const professoresData: { servidorId:number }[] =
  servidoresRecebidos === null
    ? idsServidoresAssociados.map(id => ({
        servidorId:id
      }))
    : servidoresRecebidos
        .map((professor:any)=>({
          servidorId:
            professor.servidorId ??
            professor.servidor?.idservidor ??
            professor.idservidor
        }))
        .filter(
          (professor:any)=>professor.servidorId
        );




// Remove professores desmarcados
const idsRemover =
  idsServidoresAssociados.filter(
    (servidorId:number)=>
      !professoresData.some(
        (professor:{servidorId:number}) =>
          professor.servidorId === servidorId
      )
  );



if(idsRemover.length > 0){

  await prisma.pee_servidor.deleteMany({

    where:{
      peeId:id,

      servidorId:{
        in:idsRemover
      }

    }

  });

}




// Evita duplicação
const novosServidores =
  professoresData.filter(
    (professor:{servidorId:number}) =>
      !idsServidoresAssociados.includes(
        professor.servidorId
      )
  );





const updatePEE =
  await prisma.pee.update({

    where:{
      idpee:id
    },


    data:{


      conteudo:
        pee.conteudo ?? undefined,


      metodologia:
        pee.metodologia ?? undefined,


      trabalhos:
        pee.trabalhos ?? undefined,


      bibliografia:
        pee.bibliografia ?? undefined,


      criterios:
        pee.criterios ?? undefined,



      prazofinal:
        pee.prazofinal &&
        !isNaN(new Date(pee.prazofinal).getTime())
          ? new Date(pee.prazofinal)
          : undefined,



      red:
        pee.RED_idRED
          ? {
              connect:{
                idRED:pee.RED_idRED
              }
            }
          : undefined,



      disciplinas:
        pee.disciplinas_iddisciplinas
          ? {
              connect:{
                iddisciplinas:
                  pee.disciplinas_iddisciplinas
              }
            }
          : undefined,



      situacao:
        pee.situacao ?? undefined,



      canalComunicacao:
        pee.canalComunicacao ?? undefined,



      observacoes:
        pee.observacoes ?? undefined,



      avaliacaoAtividade:
        pee.avaliacaoAtividade ?? undefined,



      percentualabono:
        pee.percentualabono ?? undefined,



      prazoEntregaAtividade:
        pee.prazoEntregaAtividade ?? undefined,



      dataEntregaAtividade:
        pee.dataEntregaAtividade
          ? converterData(pee.dataEntregaAtividade)
          : undefined,



      cumpriuAtividade:
        pee.cumpriuAtividade ?? undefined,



      houveAvaliacao:
        pee.houveAvaliacao ?? undefined,



      avaliacoesRealizadas:
        pee.avaliacoesRealizadas ?? undefined,



      dataAvaliacao:
        pee.dataAvaliacao
          ? converterData(pee.dataAvaliacao)
          : undefined,



      pee_servidor:

        novosServidores.length > 0

          ? {
              create:novosServidores
            }

          : undefined


    },


    include:{


      pee_servidor:{
        include:{
          servidor:true
        }
      },


      disciplinas:true,


      red:{
        include:{
          aluno:true
        }
      }


    }

  });





// ENVIA EMAIL QUANDO O PEE FOR PARA AVALIAÇÃO
if(
  peeAnterior &&
  peeAnterior.situacao === "Aguardando Docente" &&
  updatePEE.situacao === "Aguardando Avaliação"
){

  await emailcontroller.SendEmailAlunoAguardandoAvaliacaoPEE(
    updatePEE
  );

}





return{

  ok:true,

  data:updatePEE

};

    } catch (error: any) {
      console.log(
        "ERRO COMPLETO UPDATE:",
        error
      );


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
