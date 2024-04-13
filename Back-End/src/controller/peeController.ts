import { Request, Response } from 'express';
import { peeService } from '../service/peeService';
import { StatusCodes } from 'http-status-codes';
import { sendEmail } from '../service/email';
import { redController } from './redController';
import { alunoService } from '../service/alunoService';
import { SourceTextModule } from 'vm';

const peeservice = new peeService();
const alunoservice = new alunoService();
const redcontroller = new redController();

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
      return res.status(StatusCodes.OK).send(response.data);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async CreateAtividade(req: Request, res: Response) {
    const response = await peeservice.createAtividade(req.body);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response.data);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Delete(req: Request, res: Response) {
    const response = await peeservice.delete(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async DeleteAtividade(req: Request, res: Response) {
    const response = await peeservice.deleteAtividade(
      Number(req.params.id),
      Number(req.params.idpee)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Update(req: Request, res: Response) {
    const response = await peeservice.update(req.body, Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async UpdateAtividade(req: Request, res: Response) {
    const response = await peeservice.updateAtividade(
      req.body,
      Number(req.params.id)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async UpdateWithEmail(req: Request, res: Response) {
    const response = await peeservice.update(req.body, Number(req.params.id));

    if (response.ok) {
      if (typeof response.data === 'object' && 'RED_idRED' in response.data) {
        const RED_idRED = response.data.RED_idRED;
        const redAluno = (await redcontroller.getById(RED_idRED)).data;

        if (
          redAluno &&
          typeof redAluno === 'object' &&
          'aluno_id' in redAluno
        ) {
          const alunoId = redAluno.aluno_id;
          const alunoDetails = await alunoservice.findById(alunoId);

          if (
            alunoDetails &&
            alunoDetails.ok &&
            alunoDetails.data &&
            typeof alunoDetails.data === 'object'
          ) {
            const alunoData = alunoDetails.data as {
              prontuario: string;
              nome: string;
              dataNascimento: Date;
              endereco: string;
              telefone: string;
              email: string;
              curso_idcurso: number;
              id: number;
            };
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256');
            hash.update(req.params.id.toString());
            const hashPEE = hash.digest('hex');
            const alunoEmail = alunoData.email;
            console.log(alunoEmail);
            const texto = `
                        As atividades do professor foram enviadas. 👍

                        Por favor, clique aqui: http://red.pep2.ifsp.edu.br/usuario/${hashPEE} para ser redirecionado à página do exercício.
          
                        Atenciosamente,

                        Equipe de suporte do RED.
                        `;
            sendEmail(alunoEmail, 'Inicio das atividades', texto);
          } else {
            console.log('Detalhes do aluno não encontrados ou erro na busca.');
          }
        }
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
