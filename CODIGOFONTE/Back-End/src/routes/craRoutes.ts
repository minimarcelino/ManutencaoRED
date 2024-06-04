import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { servidorController } from "../controller/servidorController";
import { emailController } from "../controller/emailController";

const router = express.Router();
const authentication = new AuthenticationService();
const cracontroller = new servidorController();

router.get('/', authentication.validate, cracontroller.getCra);
router.get('/all', authentication.validate, cracontroller.getAll);
router.post('/create', authentication.validate, cracontroller.Create);
router.put('/update/:id', authentication.validate, cracontroller.Update);
router.delete('/delete/:id', authentication.validate, cracontroller.Delete);


export default router;
