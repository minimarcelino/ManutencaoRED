import express from "express";
import { PeeController } from "../controller/peeController";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const peecontroller = new PeeController();
const servidorcontroller = new servidorController();

router.get('/:hash', peecontroller.getByHash);
router.post('/recoveryPassword', servidorcontroller.sendEmailRecoveryPassword);

export default router;
