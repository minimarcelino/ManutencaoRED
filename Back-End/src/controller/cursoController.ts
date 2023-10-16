import { Request,Response } from "express";
import { cursoService } from "../service/cursoService";
import { StatusCodes } from "http-status-codes";

const cursoservice = new cursoService();
const jwt = require("jsonwebtoken");

export class cursoController {
    async getCursos(req: Request, res: Response){
        const { search, page, perPage, orderBy} = req.query;
        const response = await cursoservice.findMany(String(search), Number(page),
        Number(perPage), String(orderBy));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getAll(req: Request, res: Response){
        const response = await cursoservice.findAll();      
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Create(req: Request, res: Response){
        const response = await cursoservice.create(req.body);
        if (response.ok){
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }

    async Delete(req: Request, res: Response){
        const response = await cursoservice.delete(Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Update(req: Request, res: Response){
        const response = await cursoservice.update(req.body, Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }
}
