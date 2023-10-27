import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { servidorController } from "../controller/servidorController";
import { emailController } from "../controller/emailController";

const router = express.Router();
const authentication = new AuthenticationService();
const cracontroller = new servidorController();
const emailcontroller = new emailController();

router.get('/', authentication.validate, cracontroller.getCra);
router.get('/all', cracontroller.getAll);
router.post('/create', cracontroller.Create);
router.put('/update/:id',authentication.validate,  cracontroller.Update);
router.delete('/delete/:id',authentication.validate, cracontroller.Delete);
router.get('/sendEmail', emailcontroller.SendEmail);

export default router;