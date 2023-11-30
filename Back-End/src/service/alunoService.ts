import { aluno } from "@prisma/client";
import { prisma } from "../../prisma/client"
import { StatusCodes } from 'http-status-codes';

export class alunoService {

    async findAll() {
        try {
            const [alunos, length] = await Promise.all([
                prisma.aluno.findMany({
                    include: {
                        curso: true,
                    }
                }),
                prisma.aluno.count({})
            ]);

            const data = {
                alunos,
                length,
            };
            return { ok: true, data: data };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async create(aluno: aluno) {
        try {
            const existingAluno = await prisma.aluno.findFirst({
                where: {
                    prontuario: aluno.prontuario,
                },
            });

            if (existingAluno) {
                return { ok: false, data: 'aluno com esse prontuário já existe' };
            }
            const createAluno = await prisma.aluno.create({ data: aluno });
            return { ok: true, data: createAluno };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async update(aluno: aluno, id: number) {
        try {
            const existingAluno = await prisma.aluno.findFirst({
                where: {
                    prontuario: aluno.prontuario,
                    NOT: {
                        id: +id,
                    },
                },
            });

            if (existingAluno) {
                return { ok: false, data: 'aluno com esse prontuário já existe' };
            } else {
                const updateAluno = await prisma.aluno.update({
                    where: {
                        id: +id,
                    },
                    data: {
                        prontuario: aluno.prontuario,
                        nome: aluno.nome,
                        dataNascimento: aluno.dataNascimento,
                        endereco: aluno.endereco,
                        telefone: aluno.telefone,
                        email: aluno.email,
                        curso_idcurso: aluno.curso_idcurso,
                    }
                });
                return { ok: true, data: updateAluno }
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async delete(id: number) {
        try {
            const deleteAluno = await prisma.aluno.delete({
                where: {
                    id: +id,
                },
            });
            return { ok: true, data: deleteAluno };
        } catch (error) {
            console.log(error);
            return { ok: false, data: 'Aluno esta presente em um RED' }
        }
    }

    async findById(id: number) {
        try {
            const aluno = await prisma.aluno.findUnique({
                where: {
                    id: +id,
                },
            });
            return { ok: true, data: aluno };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }
}
