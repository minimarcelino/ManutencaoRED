import { Request, Response} from 'express';
import { alunoService } from '../service/alunoService'
import { StatusCodes } from 'http-status-codes';

const alunoservice = new alunoService();
const jwt = require("jsonwebtoken");

export class alunoController {
        async getAlunos(req: Request, res: Response){
            const { search, page, perPage, orderBy} = req.query;
            const response = await alunoservice.findMany(String(search), Number(page),
            Number(perPage), String(orderBy));
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }

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
                return res.status(200).send(response.data)
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response)
            }
        }

        async Delete(req: Request, res: Response){
            const response = await alunoservice.delete(String(req.params.id));
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }

        async Update(req: Request, res: Response){
            const response = await alunoservice.update(req.body, String(req.params.id));
            if(response.ok){
                return res.status(StatusCodes.OK).send(response);
            } else{
                return res.status(StatusCodes.BAD_REQUEST).send(response);
            }
        }

        /*async Login(req: Request, res: Response){
            const { prontuario, email} = req.body;
            const response = await alunoservice.findLogin(prontuario, email);
            if(response.ok){
                const payload = {
                    userProntuario: prontuario,
                    lastActivity: Math.floor(Date.now() / 1000)
                }
                const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                return res.status(StatusCodes.OK).json({
                    token: token,
                    data: response.data
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Login Failed!!"});
        }*/
}


