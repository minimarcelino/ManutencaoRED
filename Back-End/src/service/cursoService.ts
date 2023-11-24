import { curso } from '@prisma/client';
import { prisma } from "../../prisma/client";
import { StatusCodes } from "http-status-codes";

export class cursoService{

    async findMany(search: string, page: number, perPage: number, orderBy: string){
        try {
            let skip: number = (Number(page) - 1) * Number(perPage);
            const [cursos, length] = await Promise.all([
                prisma.curso.findMany({
                    where: {
                        nomeCurso: {
                            contains: String(search),
                        },
                    },
                    take: Number(perPage),
                    skip: skip,
                    //@ts-ignore
                    orderBy: {
                        nomeCurso: String(orderBy),
                    },
                }),
                prisma.curso.count({
                    where: {
                        nomeCurso: {
                            contains: String(search),
                        },
                    },
                }),
            ]);

            const data = {
                cursos,
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
            const [cursos, length] = await Promise.all([
                prisma.curso.findMany({}),
                prisma.curso.count({})
            ]);

            const data = {
                cursos,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async create(curso : curso){
        try {
            const existingCurso = await prisma.curso.findFirst({
                where: {
                  sigla: curso.sigla,
                },
              });
          
              if (existingCurso) {
                return { ok: false, data: 'Este curso com esta sigla já existe' };
              }
              else {
                const createCurso = await prisma.curso.create({ data: curso });
                return { ok: true, data: createCurso };
              }     
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async update(curso: curso, id: number){
        try {
            const existingCurso = await prisma.curso.findFirst({
                where: {
                  sigla: curso.sigla,
                  NOT: {
                    idcurso: +id,
                  },
                },
              });
          
              if (existingCurso) {
                return { ok: false, data: 'Este curso com esta sigla já existe' };
              } else {
                const updateCurso = await prisma.curso.update({
                    where: {
                        idcurso: id,
                    },
                    data: {
                        sigla: curso.sigla,
                        nomeCurso: curso.nomeCurso,
                        coordenador: curso.coordenador
                    }});
                    return {ok: true, data: updateCurso}
              }
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async delete(id: number){
        try {
            const deleteCurso = await prisma.curso.delete({
                where: {
                    idcurso: id,
                },
            });
            return {ok: true, data: deleteCurso};
        } catch (error) {
            console.log(error);
            return {ok: false, data: "Tem aluno presente neste curso."}
        }
    }

    async findById(id: number){
        try {
            const curso = await prisma.curso.findUnique({
                where: {
                    idcurso: +id,
                },
            });
            return {ok: true, data: curso};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }
}
