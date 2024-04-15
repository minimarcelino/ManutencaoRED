import { Request, Response } from 'express';
import { peeService } from '../service/peeService';
import { StatusCodes } from 'http-status-codes';
import { sendEmail } from '../service/email';
import { redController } from './redController';
import { alunoService } from '../service/alunoService';
import { servidorService } from '../service/servidorService';
import { SourceTextModule } from 'vm';
import { coordenadorController } from './coodenadorController';

const peeservice = new peeService();
const alunoservice = new alunoService();
const redcontroller = new redController();
const servidorservice = new servidorService();


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
        if (redResponse.ok && redResponse.data != null) {
          if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
            const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
            const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
            if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
              const coordenador = coordenadorResponse.data;
              if (typeof coordenador !== 'string' && coordenador) {
                const coordenadorEmail = coordenador.email;
                if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                  const aluno_prontuario = alunoResponse.data.prontuario;
                  const texto =
                    `O processo RED do aluno ${aluno_prontuario} possui novas disciplinas adicionadas.
                      
                  Por favor, entre no sistema e associe os professores responsaveis.
                  
                  Atenciosamente,
                  
                  Equipe de suporte do RED.
                  `;
                  sendEmail(coordenadorEmail, "Inicio do Processo RED", texto);
                  console.log("Email Enviado");
                  return res.status(StatusCodes.OK).send(response.data);
                }
              }
            }
          }
        }
      }
    }
    return res.status(StatusCodes.BAD_REQUEST).send(response);

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
      if (typeof response.data === 'object' && 'metodologia' in response.data) {
        if (response.data.metodologia != "") {
          const idRed = response.data.RED_idRED;
          const redResponse = await redcontroller.getById(idRed);
          if (redResponse.ok && redResponse.data != null) {
            if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
              const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
              const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
              if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
                const coordenador = coordenadorResponse.data;
                if (typeof coordenador !== 'string' && coordenador) {
                  const coordenadorEmail = coordenador.email;
                  if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                    const aluno_prontuario = alunoResponse.data.prontuario;
                    const texto =
                      `O processo RED do aluno ${aluno_prontuario} foi finalizado.
                                                
                      Atenciosamente,
                      
                      Equipe de suporte do RED.
                      `;
                    sendEmail(coordenadorEmail, "Inicio do Processo RED", texto);
                    console.log("Email Enviado");
                    return res.status(StatusCodes.OK).send(response.data);
                  }
                }
              }
            }
          }
        }
        if (typeof response.data === 'object' && 'servidor_idservidor' in response.data) {
          const servidor_idservidor = response.data.servidor_idservidor;
          if (servidor_idservidor != null) {
            const servidorResponse = await servidorservice.findByid(servidor_idservidor);
            if (servidorResponse.ok && servidorResponse.data != null) {
              if (typeof servidorResponse.data === 'object' && 'email' in servidorResponse.data) {
                const servidor = servidorResponse.data;
                if (typeof servidor !== 'string' && servidor) {
                  const servidorEmail = servidor.email;
                  const texto =
                    `Existe uma nova PEE associada a você.
          
                Por favor, entre no sistema e preencha a PEE.
                
                Atenciosamente,
                
                Equipe de suporte do RED.
                `;
                  sendEmail(servidorEmail as string, "Inicio do Processo PEE", texto);
                  console.log("Email Enviado");
                  return res.status(StatusCodes.OK).send(response);
                }
              }
            }
          }
        }
      }
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
