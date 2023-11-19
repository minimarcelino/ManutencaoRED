import express from "express";
import { peeController } from "../controller/peeController";

const router = express.Router();
const peecontroller = new peeController();

router.get('/:id', peecontroller.getById);

export default router;