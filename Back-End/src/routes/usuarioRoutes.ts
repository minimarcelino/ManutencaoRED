import express from "express";
import { PeeController } from "../controller/peeController";
import { emailController } from './../controller/emailController';

const router = express.Router();
const peecontroller = new PeeController();
const emailcontroller = new emailController();

router.get('/:hash', peecontroller.getByHash);
router.post('/recoveryPassword', emailcontroller.sendEmailTrocarSenha);

export default router;
