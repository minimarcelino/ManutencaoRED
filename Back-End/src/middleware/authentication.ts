import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";

const extractToken = (req: Request) => {
  const authorization = req.headers.authorization || "";

  return authorization.replace("Bearer ", "");
};

export class AuthenticationService {
  async validate(request: Request, response: Response, next: NextFunction) {
    const token = extractToken(request);

    if (!token)
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ auth: false, message: "No token provided." });
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userProntuario: string, lastActivity: number };
      const inactivityLimit = 50 * 60;
      if (Math.floor(Date.now() / 1000) - decoded.lastActivity > inactivityLimit) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .json({ auth: false, message: "The session ended due to inactivity." });
      }

      decoded.lastActivity = Math.floor(Date.now() / 1000);

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .json({ auth: false, message: "The session ended." });
      }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
  }
}
