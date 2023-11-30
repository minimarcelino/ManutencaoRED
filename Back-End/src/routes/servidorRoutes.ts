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
router.post('/coordenador/create',authentication.validate, servidorcontroller.CreateDisciplina);
router.put('/update/:id',authentication.validate, servidorcontroller.Update);
router.put('/updatePerfil/:id',authentication.validate, servidorcontroller.UpdatePerfil);
router.delete('/delete/:id', authentication.validate,servidorcontroller.Delete);
router.post('/login', servidorcontroller.Login);
router.get('/profile', servidorcontroller.getProfile);
router.post('/cra/processo-red/create', servidorcontroller.createRED);
router.put('/updatePerfil/:id',authentication.validate, servidorcontroller.UpdatePerfil);
export default router;