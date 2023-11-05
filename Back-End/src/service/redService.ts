import { red } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { StatusCodes } from "http-status-codes";

export class redService {

    async findAll(){
        try {
            const [reds, length] = await Promise.all([
                prisma.red.findMany({}),
                prisma.red.count({})
            ]);

            const data = {
                reds,
                length,
            };
            return {ok: true, data: data};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR};
        }
    }

    async create(red : red){
        try {
            const createRed = await prisma.red.create({ data: red });
            return { ok: true, data: createRed };
                
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async update(red: red, id: number){
        try {
                const updateRed = await prisma.red.update({
                    where: {
                        idRED: id,
                    },
                    data: {
                        data_inicio_processo: red.data_inicio_processo,
                        dataInicioRed: red.dataInicioRed,
                        dataLimitePee: red.dataLimitePee,
                        dataPrevisaoTermino: red.dataPrevisaoTermino,
                        motivoAfastamento: red.motivoAfastamento,
                        situacao: red.situacao,
                        aluno_prontuario: red.aluno_prontuario,
                        coordenador: red.coordenador,
                        aluno_id: red.aluno_id
                    }});
                    return {ok: true, data: updateRed}
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async delete(id: number){
        try {
            const deleteCurso = await prisma.red.delete({
                where: {
                    idRED: id,
                },
            });
            return {ok: true, data: deleteCurso};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }

    async findById(id: number){
        try {
            const curso = await prisma.red.findUnique({
                where: {
                    idRED: +id,
                },
            });
            return {ok: true, data: curso};
        } catch (error) {
            console.log(error);
            return {ok: false, data: StatusCodes.INTERNAL_SERVER_ERROR}
        }
    }
}