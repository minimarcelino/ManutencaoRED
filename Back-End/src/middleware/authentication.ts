import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

const extractToken = (req: Request) => {
  const authorization = req.headers.authorization || '';

  return authorization.replace('Bearer ', '');
};

// Simula um armazenamento de dados para a hora da última atividade do usuário
const lastActivityMap: Map<string, number> = new Map();

export class AuthenticationService {
  async validate(request: Request, response: Response, next: NextFunction) {
    const token = extractToken(request);
    try {
      if (!token)
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .json({ auth: false, message: 'No token provided.' });

      // Verifica se há uma hora de última atividade registrada para o usuário
      const lastActivity = lastActivityMap.get(token);

      const inactivityLimit = 1 * 60; // Tempo limite de inatividade em segundos (30 minutos)
      const currentTime = Math.floor(Date.now() / 1000);

      if (lastActivity && currentTime - lastActivity > inactivityLimit) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .json({
            auth: false,
            message: 'The session ended due to inactivity.',
          });
      }

      // Atualiza a hora da última atividade do usuário
      lastActivityMap.set(token, currentTime);

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .json({ auth: false, message: 'The session ended.' });
      }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ auth: false, message: 'Failed to authenticate token.' });
    }
  }
}
