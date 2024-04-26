import e, { Request, Response } from 'express';
import { servidorService } from '../service/servidorService';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { sendEmail } from '../service/email';
import { alunoService } from '../service/alunoService';
import exp from 'constants';

const servidorservice = new servidorService();
const jwt = require('jsonwebtoken');

export class servidorController {
  async getServidores(req: Request, res: Response) {
    const { search, page, perPage, orderBy } = req.query;
    const response = await servidorservice.findMany(
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

  async Create(req: Request, res: Response) {
    const response = await servidorservice.create(req.body);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response.data);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Delete(req: Request, res: Response) {
    const response = await servidorservice.delete(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Update(req: Request, res: Response) {
    const response = await servidorservice.update(
      req.body,
      Number(req.params.id)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async UpdatePerfil(req: Request, res: Response) {
    const response = await servidorservice.updatePerfil(
      req.body,
      Number(req.params.id)
    );
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getAll(req: Request, res: Response) {
    const response = await servidorservice.findAll();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getCra(req: Request, res: Response) {
    const response = await servidorservice.findCra();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Login(req: Request, res: Response) {
    const { prontuario, senha, tipo } = req.body;
    const response = await servidorservice.findLogin(prontuario, senha);
    if (response.ok) {
      const payload = {
        prontuario: prontuario,
        type: tipo,
        lastActivity: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      return res.status(StatusCodes.OK).json({
        token: token,
        data: response.data,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Login Falho!!' });
  }

  async getProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401);
    }

    const token = authorization.split(' ')[1];

    const { userEmail, type, lastActivity } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET ?? ''
    ) as JwtPayload;

    const response = await servidorservice.findByEmail(userEmail);

    if (response.ok) {
      return res.status(StatusCodes.OK).json({
        data: response.data,
      });
    }
    return res.status(401);
  }

  async sendEmailRecoveryPassword(req: Request, res: Response) {
    const { prontuario } = req.body;
    const response = await servidorservice.findByProntuario(prontuario);
    if (response.ok) {
      if (
        typeof response.data === 'object' &&
        'email' in response.data &&
        'nome' in response.data
      ) {
        const email = response.data.email;
        const nome = response.data.nome;
        const id = response.data.idservidor;
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        const data = Date.now();

        hash.update(id.toString()+data.toString());
        const token = hash.digest('hex');
        servidorservice.updateToken(id, token)
        
        const texto = `Olá ${nome}! Recebemos sua solicitação de recuperação de senha.
                      
                  Por favor, clique aqui para redefinir sua senha: http://red.pep2.ifsp.edu.br/usuario/${token} para ser redirecionado à página do exercício.
                  
                  Atenciosamente,
                  
                  Equipe de suporte do RED.
                  `;
        sendEmail(email, 'Recuperação de senha', texto);
        console.log('Email Enviado');
        return res.status(StatusCodes.OK).send(response.data);
      }
    }
    return res.status(StatusCodes.BAD_REQUEST).send(response);
  }

  async getByToken(req: Request, res: Response) {
    console.log("oi");
    const response = await servidorservice.findByToken(req.params.token);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }
  
}
