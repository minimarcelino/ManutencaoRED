import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { cursoController } from "../controller/cursoController";

const router = express.Router();
const authentication = new AuthenticationService();
const cursocontroller =  new cursoController();

router.get('/', authentication.validate, cursocontroller.getCursos);
router.get('/all', authentication.validate, cursocontroller.getAll);
router.post('/create', authentication.validate, cursocontroller.Create);
router.put('/update/:id', authentication.validate, cursocontroller.Update);
router.delete('/delete/:id', authentication.validate, cursocontroller.Delete);

export default router;