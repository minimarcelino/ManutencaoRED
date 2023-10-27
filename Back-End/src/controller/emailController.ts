import { sendEmail } from "../service/email";
import { Request, Response } from "express";

export class emailController {

async SendEmail(req: Request, res: Response) {
    
    sendEmail();
}

}