import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const authentication = new AuthenticationService();
const servidorcontroller =  new servidorController();

router.post('/login', servidorcontroller.Login);
export default router;

