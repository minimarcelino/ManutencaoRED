import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { redService } from '../service/redService';
import { servidorService } from '../service/servidorService';
import { alunoService } from '../service/alunoService';
import { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../service/email';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const alunoservice = new alunoService();
const servidorservice = new servidorService();
const redservice = new redService();
const jwt = require('jsonwebtoken');

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
      if (typeof response.data === 'object' && 'coordenador' in response.data) {
        const coordenadorResponse = await servidorservice.findByIdCoordenador(
          response.data.coordenador
        );

        if (coordenadorResponse.ok) {
          const coordenador = coordenadorResponse.data;

          if (typeof coordenador !== 'string' && coordenador) {
            const coordenadorEmail = coordenador.email;
            const aluno = await alunoservice.findById(response.data.aluno_id);
            if (
              aluno.data != null &&
              typeof aluno.data == 'object' &&
              'prontuario' in aluno.data
            ) {
              const aluno_prontuario = aluno.data.prontuario;
              const html = `
                <html>
                <head>
                  <title>Inicio do Processo RED</title>
                </head>
                <body>
                  <p>O processo RED do aluno ${aluno_prontuario} foi criado.</p>
                  <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/">clique aqui</a> para acessar ao site e confirme a abertura do Processo RED.</p>
                  <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                </body>
                </html>`;
              sendEmail(coordenadorEmail, 'Inicio do Processo RED', html);
              console.log('Email Enviado');
            }
          }
        }
        // Save images if present
        const requestArquivos = req.files as Express.Multer.File[];
        const arquivos = requestArquivos.map((arquivo) => {
            return {
                path: arquivo.filename,
            };
        });

        // Assuming 'response.data' contains the newly created 'red' object
        const redId = response.data.idRED;
        await prisma.arquivo.createMany({
            data: arquivos.map((arquivo) => ({
                path: arquivo.path,
                red_idRED: redId,
            })),
        });
        
        return res.status(StatusCodes.OK).send(response.data);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).send(response);
      }
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

