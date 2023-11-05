import { Request, Response} from 'express';
import { StatusCodes } from 'http-status-codes';
import { redService } from '../service/redService';

const redservice = new redService();
const jwt = require("jsonwebtoken");

export class redController {

    async getAll(req: Request, res: Response){
        const response = await redservice.findAll();      
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Create(req: Request, res: Response){
        const response = await redservice.create(req.body);
        if (response.ok){
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }

    async Delete(req: Request, res: Response){
        const response = await redservice.delete(Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }

    async Update(req: Request, res: Response){
        const response = await redservice.update(req.body, Number(req.params.id));
        if(response.ok){
            return res.status(StatusCodes.OK).send(response);
        } else{
            return res.status(StatusCodes.BAD_REQUEST).send(response);
        }
    }
}