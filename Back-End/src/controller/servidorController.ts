import { Request, Response } from "express";
import { servidorService } from '../service/servidorService';
import { StatusCodes } from 'http-status-codes';

const servidorservice = new servidorService();
const jwt = require('jsonwebtoken');

export class servidorController {
    async getServidores(req: Request, res: Response){
        const { search, page, perPage, orderBy} = req.query;
        const response = await servidorservice.findMany(String(search), Number(page),
        Number(perPage), String(orderBy));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getServidor(req: Request, res: Response){
        const response = await servidorservice.findById(Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getAll(req: Request, res: Response){
        const response = await servidorservice.findAll();      
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getCoordenador(req: Request, res: Response){
        const response = await servidorservice.findCoordenador();
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Login(req: Request, res: Response){
        const { email, senha, tipo} = req.body;
        const response = await servidorservice.findLogin(email, senha);
        if(response.ok){
            const payload = {
                userEmail: email,
                type: tipo,
                lastActivity: Math.floor(Date.now() / 1000)
            }
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            return res.status(StatusCodes.OK).json({
                token: token,
                data: response.data
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Login Failed!!"});
    }
}
