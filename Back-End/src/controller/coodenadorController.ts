import { Request, Response } from 'express';
import { servidorService } from '../service/servidorService';
import { StatusCodes } from 'http-status-codes';

const servidorservice = new servidorService();
const jwt = require('jsonwebtoken');

export class coordenadorController {
  async getCoordenadores(req: Request, res: Response) {
    const response = await servidorservice.findCoordenador();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getCoordenadorById(req: Request, res: Response) {
    const response = await servidorservice.findByIdCoordenador(
      Number(req.params.id)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }
}
