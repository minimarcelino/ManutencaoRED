import { aluno } from '@prisma/client';
import { prisma } from "../../prisma/client"
import { StatusCodes } from 'http-status-codes';

export class alunoService{

    async findMany(search: string, page: number, perPage: number, orderBy: string){
        try {
            let skip: number = (Number(page) - 1) * Number(perPage);
            const [alunos, length] = await Promise.all([
                prisma.aluno.findMany({
                    where: {
                        nome: {
                            contains: String(search),
                        },
                    },
                    take: Number(perPage),
                    skip: skip,
                    //@ts-ignore
                    orderBy: {
                        nome: String(orderBy),
                    },
                }),
                prisma.aluno.count({
                    where: {
                        nome: {
                            contains: String(search),
                        },
                    },
                }),
            ]);

            const data = {
                alunos,
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
            const [alunos, length] = await Promise.all([
                prisma.aluno.findMany({}),
                prisma.aluno.count({})
            ]);

            const data = {
                alunos,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async create(aluno : aluno){
        try {
            const existingAluno = await prisma.aluno.findFirst({
                where: {
                  nome: aluno.nome,
                  email: aluno.email,
                  prontuario: aluno.prontuario
                },
              });
          
              if (existingAluno) {
                return { ok: false, data: 'aluno já existe' };
              }
            const createAluno = await prisma.aluno.create({data: aluno});
            return {ok: true, data : createAluno};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async update(aluno: aluno, prontuario: string){
        try {
            const updateAluno = await prisma.aluno.update({
                where: {
                    prontuario: prontuario,
                },
                data: aluno});
                return {ok: true, data: updateAluno}
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async delete(prontuario: string){
        try {
            const deleteAluno = await prisma.aluno.delete({
                where: {
                    prontuario: prontuario,
                },
            });
            return {ok: true, data: deleteAluno};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async findById(prontuario: string){
        try {
            const aluno = await prisma.aluno.findUnique({
                where: {
                    prontuario: prontuario,
                },
            });
            return {ok: true, data: aluno};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    /*async findLogin(prontuario: string, email: string){
        try {
            const usuario = await prisma.aluno.findMany({
                where: {
                    prontuario: prontuario,
                    email: email,
                },
            })
            if(usuario.length == 0){
                return {ok: false, data: StatusCodes.NOT_FOUND};
            }
            return {ok: true, data: usuario[0]};
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
        }
    }*/
}
