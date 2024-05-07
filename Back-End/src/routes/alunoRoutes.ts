import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { alunoController } from "../controller/alunoController";

const router = express.Router();
const authentication = new AuthenticationService();
const alunocontroller =  new alunoController();

router.get('/all', authentication.validate ,alunocontroller.getAll);
router.post('/create', authentication.validate ,alunocontroller.Create);
router.put('/update/:id', authentication.validate,  alunocontroller.Update);
router.delete('/delete/:id', authentication.validate, alunocontroller.Delete);

export default router;