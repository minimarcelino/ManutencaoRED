import { servidor } from '@prisma/client';
import { prisma } from "../../prisma/client";
import { StatusCodes} from 'http-status-codes';

export class servidorService{
    async findMany(search: string, page: number, perPage: number, orderBy: string){
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
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return { ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async findAll(){
        try {
            const [servidores, length] = await Promise.all([
                prisma.servidor.findMany({}),
                prisma.servidor.count({})
            ]);

            const data = {
                servidores,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async create(servidor : servidor){
        try {
            const createServidor = await prisma.servidor.create({data: servidor});
            return {ok: true, data : createServidor};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async update(servidor: servidor, id: number){
        try {
            const updateServidor = await prisma.servidor.update({
                where: {
                    idservidor: +id,
                },
                data: servidor});
                return {ok: true, data: updateServidor}
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async findById(id: number){
        try {
            const servidor = await prisma.servidor.findUnique({
                where: {
                    idservidor: +id,
                },
            });
            return {ok: true, data: servidor};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async delete(id: number){
        try {
            const deleteServidor = await prisma.servidor.delete({
                where: {
                    idservidor: +id,
                },
            });
            return {ok: true, data: deleteServidor};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async findLogin(email: string, senha: string, tipo: number){
        try {
            const usuario = await prisma.servidor.findMany({
                where: {
                    email: email,
                    senha: senha,
                    tiposervidor: tipo,
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
    }


}