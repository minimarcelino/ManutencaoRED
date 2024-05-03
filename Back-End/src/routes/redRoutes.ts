import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { redController } from "../controller/redController";

const router = express.Router();
const authentication = new AuthenticationService();
const redcontroller =  new redController();

router.get('/all', authentication.validate, redcontroller.getAll);
router.post('/create', authentication.validate, redcontroller.Create);
router.put('/update/:id', authentication.validate, redcontroller.Update);
router.put('/update/situacao/:id', authentication.validate, redcontroller.UpdateSituacao);
router.delete('/delete/:id', authentication.validate, redcontroller.Delete);

export default router;
