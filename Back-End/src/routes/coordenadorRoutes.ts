import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { coordenadorController } from "../controller/coodenadorController";

const router = express.Router();
const authentication = new AuthenticationService();
const coodenadorcontroller = new coordenadorController();

router.get('/all',authentication.validate, coodenadorcontroller.getCoordenadores);
router.get('/:id',authentication.validate, coodenadorcontroller.getCoordenadorById);
export default router;
