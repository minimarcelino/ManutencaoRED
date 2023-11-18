import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { peeController } from "../controller/peeController";

const router = express.Router();
const authentication = new AuthenticationService();
const peecontroller = new peeController();

router.get('/all', authentication.validate, peecontroller.getAll);
router.post('/create', authentication.validate, peecontroller.Create);
router.put('/update/:id', authentication.validate, peecontroller.Update);
router.put('/updateWithEmail/:id', authentication.validate, peecontroller.UpdateWithEmail);
router.delete('/delete/:id', authentication.validate, peecontroller.Delete);

export default router;