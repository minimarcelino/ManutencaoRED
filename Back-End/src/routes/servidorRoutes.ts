import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const authentication = new AuthenticationService();
const servidorcontroller =  new servidorController();
//const emailcontroller = new emailController();

router.get('/',authentication.validate, servidorcontroller.getServidores);
router.get('/all',authentication.validate, servidorcontroller.getAll);
//router.get('/:id',authentication.validate, servidorcontroller.getServidor);
router.post('/create',authentication.validate, servidorcontroller.Create);
/*router.put('/update/:id',  alunocontroller.Update);
router.delete('/delete/:id', alunocontroller.Delete);*/
router.post('/login', servidorcontroller.Login);
router.get('/profile', servidorcontroller.getProfile);
router.post('/cra/processo-red/create', servidorcontroller.createRED);
export default router;