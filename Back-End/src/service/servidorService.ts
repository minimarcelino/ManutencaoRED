import { servidor, red, disciplinas } from '@prisma/client';
import { prisma } from "../../prisma/client";
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
export class servidorService {
    async findMany(search: string, page: number, perPage: number, orderBy: string) {
        try {
            let skip: number = (Number(page) - 1) * Number(perPage);
            const [servidores, length] = await Promise.all([
                prisma.servidor.findMany({
                    where: {
                        email: {
                            contains: String(search),
                        },
                    },
                    take: Number(perPage),
                    skip: skip,
                    //@ts-ignore
                    orderBy: {
                        email: String(orderBy),
                    },
                }),
                prisma.servidor.count({
                    where: {
                        email: {
                            contains: String(search),
                        },
                    },
                }),
            ]);

            const data = {
                servidores,
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
            const [servidores, length] = await Promise.all([
                prisma.servidor.findMany({}),
                prisma.servidor.count({})
            ]);

            const data = {
                servidores,
                length,
            };
            return { ok: true, data: data };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async create(servidor: servidor) {
        try {
            const existingServidor = await prisma.servidor.findFirst({
                where: {
                    prontuario: servidor.prontuario,
                }
            });

            if (existingServidor) {
                return { ok: false, data: 'docente com esse prontuário já existe', duplicateProntuario: servidor.prontuario };
            }
            else {
                // Gere o hash da senha
                const salt = await bcrypt.genSalt(10);
                const senhaHash = await bcrypt.hash(servidor.senha, salt);

                // Substitua a senha em texto simples pela senha hash
                servidor.senha = senhaHash;

                const createServidor = await prisma.servidor.create({ data: servidor });
                return { ok: true, data: createServidor };
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }


    async createDisciplina(disciplina: disciplinas) {

        try {
            const existingDisciplina = await prisma.disciplinas.findFirst({
                where: {
                    nomeDisciplina: disciplina.nomeDisciplina,
                    sigla: disciplina.sigla
                }
            });

            if (existingDisciplina) {
                return { ok: false, data: 'disciplina já existe' };
            }
            else {
                const createDisciplina = await prisma.disciplinas.create({ data: disciplina });
                return { ok: true, data: createDisciplina };
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async update(servidor: servidor, id: number) {
        try {
            const existingServidor = await prisma.servidor.findFirst({
                where: {
                    prontuario: servidor.prontuario,
                    NOT: {
                        idservidor: +id,
                    },
                },
            });

            if (existingServidor) {
                return { ok: false, data: 'docente com esse prontuário já existe', duplicateProntuario: servidor.prontuario };
            } else {
                const updateServidor = await prisma.servidor.update({
                    where: {
                        idservidor: +id,
                    },
                    data: servidor
                });
                return { ok: true, data: updateServidor }
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async updatePerfil(servidor: servidor, id: number) {
        try {
            const existingServidor = await prisma.servidor.findFirst({
                where: {
                    prontuario: servidor.prontuario,
                    NOT: {
                        idservidor: +id,
                    },
                },
            });

            if (existingServidor) {
                return { ok: false, data: 'servidor com esse email já existe', duplicateProntuario: servidor.prontuario };
            } else {
                // Gere o hash da senha
                const salt = await bcrypt.genSalt(10);
                const senhaHash = await bcrypt.hash(servidor.senha, salt);

                // Substitua a senha em texto simples pela senha hash
                servidor.senha = senhaHash;
                const updateServidor = await prisma.servidor.update({
                    where: {
                        idservidor: +id,
                    },
                    data: servidor
                });
                return { ok: true, data: updateServidor }
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async findByEmail(email: string) {
        try {
            const usuario = await prisma.servidor.findMany({
                where: {
                    email: email
                },
            })
            if (usuario.length == 0) {
                return { ok: false, data: StatusCodes.NOT_FOUND };
            }
            return { ok: true, data: usuario[0] };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async findByIdCoordenador(id: number) {
        try {
            const coordenador = await prisma.servidor.findUnique({
                where: {
                    idservidor: id
                }
            });

            if (coordenador) {
                return { ok: true, data: coordenador };
            } else {
                return { ok: false, message: 'Coordenador não encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { ok: false, message: 'Ocorreu um erro ao buscar o coordenador' };
        }
    }

    async findCoordenador() {
        try {
            const coordenadores = await prisma.servidor.findMany({
                where: {
                    tiposervidor: 'coordenador',
                },
            });
            return { ok: true, data: coordenadores };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async findCra() {
        try {
            const cras = await prisma.servidor.findMany({
                where: {
                    tiposervidor: 'cra',
                },
            });
            return { ok: true, data: cras };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async delete(id: number) {
        try {
            const deleteServidor = await prisma.servidor.delete({
                where: {
                    idservidor: +id,
                },
            });
            return { ok: true, data: deleteServidor };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    async findLogin(prontuario: string, senha: string) {
        try {
            const usuario = await prisma.servidor.findUnique({
                where: {
                    prontuario: prontuario
                },
            })
            if (!usuario) {
                return { ok: false, data: StatusCodes.NOT_FOUND };
            }

            // Verifique a senha com bcrypt
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            if (!senhaCorreta) {
                return { ok: false, data: StatusCodes.UNAUTHORIZED };
            }

            return { ok: true, data: usuario };
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async createRED(red: red) {

        try {
            const existingRED = await prisma.red.findFirst({
                where: {

                    aluno_id: red.aluno_id,
                    dataInicioProcesso: red.dataInicioProcesso
                }
            });

            if (existingRED) {
                return { ok: false, data: 'O Processo RED já existe!! ' };
            }
            else {
                const createRED = await prisma.red.create({ data: red });
                return { ok: true, data: createRED };
            }
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }


}