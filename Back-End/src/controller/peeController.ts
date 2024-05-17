import { Request, Response } from 'express';
import { peeService } from '../service/peeService';
import { StatusCodes } from 'http-status-codes';
import { emailController } from './emailController';
import { redController } from './redController';

const peeservice = new peeService();
const redcontroller = new redController();

const emailcontroller = new emailController();
export class PeeController {
  async getPees(req: Request, res: Response) {
    const { search, page, perPage, orderBy } = req.query;
    const response = await peeservice.findMany(
      String(search),
      Number(page),
      Number(perPage),
      String(orderBy)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getAll(req: Request, res: Response) {
    const response = await peeservice.findAll();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getById(req: Request, res: Response) {
    const response = await peeservice.findById(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getByIdRED(req: Request, res: Response) {
    const response = await peeservice.findByIdRED(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Create(req: Request, res: Response) {
    const response = await peeservice.create(req.body);
    if (response.ok) {
      if (typeof response.data === 'object' && 'RED_idRED' in response.data) {
        const idRed = response.data.RED_idRED;
        const redResponse = await redcontroller.getById(idRed);
        emailcontroller.SendEmailCoordenadorAssocieProfessor(redResponse);
      }
      return res.status(StatusCodes.OK).send(response.data);
    }
    return res.status(StatusCodes.BAD_REQUEST).send(response);
  }

  // async CreateAtividade(req: Request, res: Response) {
  //   const response = await peeservice.createAtividade(req.body);
  //   if (response.ok) {
  //     return res.status(StatusCodes.OK).send(response.data);
  //   } else {
  //     return res.status(StatusCodes.BAD_REQUEST).send(response);
  //   }
  // }

  async Delete(req: Request, res: Response) {
    const response = await peeservice.delete(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  // async DeleteAtividade(req: Request, res: Response) {
  //   const response = await peeservice.deleteAtividade(
  //     Number(req.params.id),
  //     Number(req.params.idpee)
  //   );
  //   if (response.ok) {
  //     return res.status(StatusCodes.OK).send(response);
  //   } else {
  //     return res.status(StatusCodes.BAD_REQUEST).send(response);
  //   }
  // }

  async Update(req: Request, res: Response) {
    const response = await peeservice.update(req.body, Number(req.params.id));

    if (response.ok) {
      if (typeof response.data === 'object' && 'metodologia' in response.data) {
        if (response.data.metodologia != "") {
          const idRed = response.data.RED_idRED;
          const redResponse = await redcontroller.getById(idRed);
          emailcontroller.SendEmailCoordenadorFinalizandoRed(redResponse);
        }else{
            emailcontroller.SendEmailProfesorIniciandoPEE(req.body);
        }
      }
      return res.status(StatusCodes.OK).send(response.data);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  // async UpdateAtividade(req: Request, res: Response) {
  //   const response = await peeservice.updateAtividade(req.body, Number(req.params.id));
  //   if (response.ok) {
  //     return res.status(StatusCodes.OK).send(response);
  //   } else {
  //     return res.status(StatusCodes.BAD_REQUEST).send(response);
  //   }
  // }

  async UpdateWithEmail(req: Request, res: Response) {
    const response = await peeservice.update(req.body, Number(req.params.id));
    if (response.ok) {
      if (typeof response.data === 'object' && 'RED_idRED' in response.data) {
        const RED_idRED = response.data.RED_idRED;
        const redAluno = (await redcontroller.getById(RED_idRED)).data;
        emailcontroller.sendEmailAluno(redAluno, req);
      }
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getByHash(req: Request, res: Response) {
    const response = await peeservice.findByHash(req.params.hash);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

}
