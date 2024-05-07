import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { redService } from '../service/redService';
import { emailController } from './emailController';

const redservice = new redService();
const emailcontroller = new emailController();

export class redController {
  async getAll(req: Request, res: Response) {
    const response = await redservice.findAll();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Create(req: Request, res: Response) {
    const response = await redservice.create(req.body);
    if (response.ok) {
      emailcontroller.sendEmailCoordenadorInicioRED(response);
      return res.status(StatusCodes.OK).send(response);
    }
    else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  /*async Create(req: Request, res: Response){
        const response = await redservice.create(req.body);
        if (response.ok){
            return res.status(StatusCodes.OK).send(response.data)
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(response)
        }
    }*/

  async Delete(req: Request, res: Response) {
    const response = await redservice.delete(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Update(req: Request, res: Response) {
    const response = await redservice.update(req.body, Number(req.params.id));
    if (response.ok) {
      if (typeof response.data === 'object' && 'situacao' in response.data){
        if(response.data.situacao == 'Em andamento'){
          emailcontroller.sendEmailCSP(response);
        }
      }
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async UpdateSituacao(req: Request, res: Response) {
    const response = await redservice.updateSituacao(req.body);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getById(id: number) {
    const response = await redservice.findById(id);
    return response;
  }
}

