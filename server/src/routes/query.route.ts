import express from "express";
import { handleQueryController } from "../controllers/query.controller";

const router = express.Router();

router.post("/query", handleQueryController);

export default router;
