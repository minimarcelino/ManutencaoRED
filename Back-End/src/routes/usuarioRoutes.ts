import express from "express";
import { PeeController } from "../controller/peeController";

const router = express.Router();
const peecontroller = new PeeController();

router.get('/:id', peecontroller.getById);

export default router;
