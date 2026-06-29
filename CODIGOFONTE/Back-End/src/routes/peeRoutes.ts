import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { PeeController } from "../controller/peeController";
import { emailController } from './../controller/emailController';

const router = express.Router();

const authentication = new AuthenticationService();
const peecontroller = new PeeController();
const emailcontroller = new emailController();

router.get('/all', authentication.validate, peecontroller.getAll);

router.get(
  '/professor/:idservidor',
  peecontroller.findByProfessor
);

router.get(
  '/professor/:id',
  authentication.validate,
  peecontroller.getByProfessor
);

router.post('/create', authentication.validate, peecontroller.Create);

router.put('/update/:id', authentication.validate, peecontroller.Update);

router.put('/updateWithEmail/:id', authentication.validate, peecontroller.UpdateWithEmail);

router.delete('/delete/:id', authentication.validate, peecontroller.Delete);

router.get('/red/:id', authentication.validate, peecontroller.getByIdRED);

router.post('/sendEmailProfessor', emailcontroller.sendEmailProfessorPreencherPEE);


export default router;