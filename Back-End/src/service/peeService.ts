import { prisma } from "../../prisma/client";
import { StatusCodes } from "http-status-codes";
import { pee } from "@prisma/client";

export class peeService {

    async findMany(search: string, page: number, perPage: number, orderBy: string) {
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
                            }
                        },
                        servidor: true,
                        disciplinas: true,
                        atividades: true,
                    }
                }),
                prisma.pee.count({})
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
    async create(pee: pee) {
        try {
            const existingPEE = await prisma.pee.findFirst({
                where: {
                    disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas
                },
            });

            if (existingPEE) {
                return { ok: false, data: 'Este PEE com esta disciplina já existe' };
            }
            else {
                const createPEE = await prisma.pee.create({ data: pee });
                return { ok: true, data: createPEE };
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async update(pee: pee, id: number) {
        try {
            const existingPEE = await prisma.pee.findFirst({
                where: {
                    disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
                    NOT: {
                        idpee: +id,
                    },
                },
            });

            if (existingPEE) {
                return { ok: false, data: 'Esta disciplina com esta sigla já existe' };
            } else {
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
                        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
                        servidor_idservidor: pee.servidor_idservidor,
                        percentualabono: pee.percentualabono,
                        dataEnvioProposta: pee.dataEnvioProposta,
                        canalComunicacao: pee.canalComunicacao,
                        houveAvaliacao: pee.houveAvaliacao,
                        avaliacoesRealizadas: pee.avaliacoesRealizadas,
                        dataAvaliacao: pee.dataAvaliacao,
                        observacoes: pee.observacoes
                    }
                });
                return { ok: true, data: updatePEE }
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
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
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }
}