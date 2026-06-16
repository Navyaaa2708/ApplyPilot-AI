import { Router } from "express";
import { ATSController } from "../controllers/ats.controller.js";

export const atsRouter = Router();

atsRouter.post("/score", ATSController.score);
atsRouter.get("/explain/:id", ATSController.explain);
