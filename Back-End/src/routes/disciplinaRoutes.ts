import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { disciplinaController } from "../controller/disciplinaController";
import { servidorController } from "../controller/servidorController";

const router = express.Router();
const authentication = new AuthenticationService();
const disciplinacontroller =  new disciplinaController();
const servidorcontroller = new servidorController();

router.get('/',authentication.validate,disciplinacontroller.getDisciplinas);
router.get('/all', disciplinacontroller.getAll);
router.post('/create',authentication.validate, disciplinacontroller.Create);
router.put('/update/:id',authentication.validate, disciplinacontroller.Update);
router.delete('/delete/:id',authentication.validate, disciplinacontroller.Delete);

export default router;
