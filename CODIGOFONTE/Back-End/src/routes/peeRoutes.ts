import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { PeeController } from "../controller/peeController";
import { emailController } from './../controller/emailController';

const router = express.Router();
const authentication = new AuthenticationService();
const peecontroller = new PeeController();
const emailcontroller = new emailController();

router.get('/all', authentication.validate, peecontroller.getAll);
//router.get('/red/:id', authentication.validate, peecontroller.getById);
router.post('/create', authentication.validate, peecontroller.Create);
// router.post('/createAtividade', authentication.validate, peecontroller.CreateAtividade);
router.put('/update/:id', authentication.validate, peecontroller.Update);
// router.put('/updateAtividade/:id', authentication.validate, peecontroller.UpdateAtividade);
router.put('/updateWithEmail/:id', authentication.validate, peecontroller.UpdateWithEmail);
router.delete('/delete/:id', authentication.validate, peecontroller.Delete);
// router.delete('/deleteAtividade/:id/:idpee', authentication.validate, peecontroller.DeleteAtividade);
router.get('/red/:id', authentication.validate, peecontroller.getByIdRED);
router.post('/sendEmailProfessor', emailcontroller.sendEmailProfessorPreencherPEE);


export default router;
