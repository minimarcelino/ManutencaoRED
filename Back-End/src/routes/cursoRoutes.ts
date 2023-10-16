import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { cursoController } from "../controller/cursoController";

const router = express.Router();
const authentication = new AuthenticationService();
const cursocontroller =  new cursoController();

router.get('/',cursocontroller.getCursos);
router.get('/all', cursocontroller.getAll);
router.post('/create', cursocontroller.Create);
router.put('/update/:id', cursocontroller.Update);
router.delete('/delete/:id',cursocontroller.Delete);

export default router;