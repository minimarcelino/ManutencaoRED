import express from "express";
import { PeeController } from "../controller/peeController";
import { emailController } from './../controller/emailController';
import { servidorController } from './../controller/servidorController';

const router = express.Router();
const peecontroller = new PeeController();
const emailcontroller = new emailController();
const servidorcontroller = new servidorController();

router.get('/:hash', peecontroller.getByHash);
router.get('/trocar-senha/:token', servidorcontroller.getByToken);
router.post('/recoveryPassword', emailcontroller.sendEmailTrocarSenha);
router.post('/trocar-senha', servidorcontroller.UpdateSenha);


export default router;
