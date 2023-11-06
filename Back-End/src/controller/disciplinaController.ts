import { Request, Response} from 'express';
import { disciplinaService } from '../service/disciplinaService'
import { StatusCodes } from "http-status-codes";

const disciplinaservice = new disciplinaService();
const jwt = require("jsonwebtoken");

export class disciplinaController {
    async getDisciplinas(req: Request, res: Response){
        const { search, page, perPage, orderBy} = req.query;
        const response = await disciplinaservice.findMany(String(search), Number(page),
        Number(perPage), String(orderBy));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getAll(req: Request, res: Response){
        const response = await disciplinaservice.findAll();      
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Create(req: Request, res: Response){
        const response = await disciplinaservice.create(req.body);
        if (response.ok){
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }

    async Delete(req: Request, res: Response){
        const response = await disciplinaservice.delete(Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Update(req: Request, res: Response){
        const response = await disciplinaservice.update(req.body, Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }
}

