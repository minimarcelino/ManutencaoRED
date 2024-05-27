import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { redController } from "../controller/redController";
import multer from "multer";
import uploadsConfig from "../config/multer";

const router = express.Router();
const authentication = new AuthenticationService();
const redcontroller =  new redController();
const upload = multer(uploadsConfig);

router.get('/all', authentication.validate, redcontroller.getAll);
router.post('/create',authentication.validate, upload.array("arquivos"), redcontroller.Create);
router.put('/update/:id',authentication.validate,  redcontroller.Update);
router.put('/update/situacao/:id',authentication.validate,  redcontroller.UpdateSituacao);
router.delete('/delete/:id',authentication.validate, redcontroller.Delete);
router.get('/files/:id', authentication.validate, redcontroller.getFiles); // Nova rota para obter arquivos

export default router;
