import { Request, Response} from 'express';
import { alunoService } from '../service/alunoService'
import { StatusCodes } from 'http-status-codes';

const alunoservice = new alunoService();
const jwt = require("jsonwebtoken");

export class alunoController {

        async getAll(req: Request, res: Response){
            const response = await alunoservice.findAll();      
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else{
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }

        async Create(req: Request, res: Response){
            const response = await alunoservice.create(req.body);
            if (response.ok){
                return res.status(StatusCodes.OK).send(response.data)
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response)
            }
        }

        async Delete(req: Request, res: Response){
            const response = await alunoservice.delete(Number(req.params.id));
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }

        async Update(req: Request, res: Response){
            const response = await alunoservice.update(req.body, Number(req.params.id));
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else{
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }
}


