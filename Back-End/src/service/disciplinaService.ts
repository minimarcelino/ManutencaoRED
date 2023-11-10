import { prisma } from "../../prisma/client";
import { StatusCodes } from "http-status-codes";
import { disciplinas } from "@prisma/client";

export class disciplinaService{

    async findMany(search: string, page: number, perPage: number, orderBy: string){
        try {
            let skip: number = (Number(page) - 1) * Number(perPage);
            const [disciplinas, length] = await Promise.all([
                prisma.disciplinas.findMany({
                    where: {
                        nomeDisciplina: {
                            contains: String(search),
                        },
                    },
                    take: Number(perPage),
                    skip: skip,
                    //@ts-ignore
                    orderBy: {
                        nomeDisciplina: String(orderBy),
                    },
                }),
                prisma.disciplinas.count({
                    where: {
                        sigla: {
                            contains: String(search),
                        },
                    },
                }),
            ]);

            const data = {
                disciplinas,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async findAll(){
        try {
            const [disciplinas, length] = await Promise.all([
                prisma.disciplinas.findMany({}),
                prisma.disciplinas.count({})
            ]);

            const data = {
                disciplinas,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async create(disciplina : disciplinas){
        try {
            const existingDisciplina = await prisma.disciplinas.findFirst({
                where: {
                  sigla: disciplina.sigla,
                },
              });
          
              if (existingDisciplina) {
                return { ok: false, data: 'Esta disciplina com esta sigla já existe' };
              }
              else {
                const createDisciplina = await prisma.disciplinas.create({ data: disciplina });
                return { ok: true, data: createDisciplina };
              }     
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async update(disciplina: disciplinas, id: number){
        try {
            const existingDisciplina = await prisma.disciplinas.findFirst({
                where: {
                  sigla: disciplina.sigla,
                  NOT: {
                    iddisciplinas: +id,
                  },
                },
              });
          
              if (existingDisciplina) {
                return { ok: false, data: 'Esta disciplina com esta sigla já existe' };
              } else {
                const updateDisciplina = await prisma.disciplinas.update({
                    where: {
                        iddisciplinas: id,
                    },
                    data: {
                        sigla: disciplina.sigla,
                        nomeDisciplina: disciplina.nomeDisciplina,
                        curso_idcurso: disciplina.curso_idcurso
                    }});
                    return {ok: true, data: updateDisciplina}
              }
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async delete(id: number){
        try {
            const deleteDisciplina = await prisma.disciplinas.delete({
                where: {
                    iddisciplinas: id,
                },
            });
            return {ok: true, data: deleteDisciplina};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async findById(id: number){
        try {
            const disciplina = await prisma.disciplinas.findUnique({
                where: {
                    iddisciplinas: +id,
                },
            });
            return {ok: true, data: disciplina};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }
}
