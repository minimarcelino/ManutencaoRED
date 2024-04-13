import express from "express";
import { PeeController } from "../controller/peeController";

const router = express.Router();
const peecontroller = new PeeController();

router.get('/:hash', peecontroller.getByHash);

export default router;
