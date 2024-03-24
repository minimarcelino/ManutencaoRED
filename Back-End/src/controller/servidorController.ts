import { Request, Response } from "express";
import { servidorService } from '../service/servidorService';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import { sendEmail } from "../service/email";
import { alunoService } from "../service/alunoService";

const servidorservice = new servidorService();
const jwt = require('jsonwebtoken');

export class servidorController {
    async getServidores(req: Request, res: Response) {
        const { search, page, perPage, orderBy } = req.query;
        const response = await servidorservice.findMany(String(search), Number(page),
            Number(perPage), String(orderBy));
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Create(req: Request, res: Response) {
        const response = await servidorservice.create(req.body);
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }

/*     async CreateDisciplina(req: Request, res: Response) {
        const response = await servidorservice.createDisciplina(req.body);
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    } */

    async Delete(req: Request, res: Response) {
        const response = await servidorservice.delete(Number(req.params.id));
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Update(req: Request, res: Response) {
        const response = await servidorservice.update(req.body, Number(req.params.id));
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async UpdatePerfil(req: Request, res: Response) {
        const response = await servidorservice.updatePerfil(req.body, Number(req.params.id));
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getAll(req: Request, res: Response) {
        const response = await servidorservice.findAll();
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getCra(req: Request, res: Response) {
        const response = await servidorservice.findCra();
        if (response.ok) {
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Login(req: Request, res: Response) {
        const { prontuario, senha, tipo } = req.body;
        const response = await servidorservice.findLogin(prontuario, senha);
        if (response.ok) {
            const payload = {
                prontuario: prontuario,
                type: tipo,
                lastActivity: Math.floor(Date.now() / 1000)
            }
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            return res.status(StatusCodes.OK).json({
                token: token,
                data: response.data
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Login Falho!!" });
    }

    async getProfile(req: Request, res: Response) {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401);
        }

        const token = authorization.split(" ")[1]

        const { userEmail, type, lastActivity } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? "") as JwtPayload

        const response = await servidorservice.findByEmail(userEmail)

        if (response.ok) {
            return res.status(StatusCodes.OK).json({
                data: response.data
            })
        }
        return res.status(401);
    }

 /*    async createRED(req: Request, res: Response) {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(StatusCodes.FORBIDDEN)
        }

        const token = authorization.split(" ")[1]

        const { userEmail, type, lastActivity } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? "") as JwtPayload

        const response = await servidorservice.createRED(req.body);
        if (response.ok) {
            if (typeof response.data === 'object' && 'coordenador' in response.data) {
                const coordenadorResponse = await servidorservice.findByIdCoordenador(response.data.coordenador);

                if (coordenadorResponse.ok) {
                  const coordenador = coordenadorResponse.data;

                  if (typeof coordenador !== 'string' && coordenador) {
                    const coordenadorEmail = coordenador.email;

                    const texto =
                      `O processo RED do aluno ${req.body.aluno_prontuario} foi criado. 👍

                      Por favor, entre no sistema e confirme a abertura do Processo RED.

                      Atenciosamente,

                      Equipe de suporte do RED.
                      `
                    sendEmail(coordenadorEmail, "Inicio do Processo RED", texto);
                  }
                }
            return res.status(StatusCodes.OK).send(response.data)
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response)
            }

        }
    } */

}
