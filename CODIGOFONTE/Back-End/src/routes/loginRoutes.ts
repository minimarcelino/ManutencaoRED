import express from "express";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const servidorcontroller =  new servidorController();

router.post('', servidorcontroller.Login);
export default router;
