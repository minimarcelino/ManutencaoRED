import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const authentication = new AuthenticationService();
const servidorcontroller =  new servidorController();

router.get('/',authentication.validate, servidorcontroller.getServidores);
router.get('/all',authentication.validate, servidorcontroller.getAll);
router.get('/:id',authentication.validate, servidorcontroller.getServidor);
/*router.post('/:id/create', alunocontroller.Create);
router.put('/update/:id',  alunocontroller.Update);
router.delete('/delete/:id', alunocontroller.Delete);*/
router.post('/login', servidorcontroller.Login);

export default router;