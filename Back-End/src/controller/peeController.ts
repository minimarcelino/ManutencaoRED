import { Request, Response} from 'express';
import { peeService } from '../service/peeService';
import { StatusCodes } from 'http-status-codes';

const peeservice = new peeService();
const jwt = require("jsonwebtoken");

export class peeController {
    async getPees(req: Request, res: Response){
        const { search, page, perPage, orderBy} = req.query;
        const response = await peeservice.findMany(String(search), Number(page),
        Number(perPage), String(orderBy));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async getAll(req: Request, res: Response){
        const response = await peeservice.findAll();      
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Create(req: Request, res: Response){
        const response = await peeservice.create(req.body);
        if (response.ok){
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }

    async Delete(req: Request, res: Response){
        const response = await peeservice.delete(Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Update(req: Request, res: Response){
        const response = await peeservice.update(req.body, Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }
}