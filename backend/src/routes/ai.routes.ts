import { Router } from "express";
import { AIController } from "../controllers/ai.controller.js";

export const aiRouter = Router();

aiRouter.post("/cover-letter", AIController.generateCoverLetter);
aiRouter.post("/local/connect", AIController.connectLocalProvider);
aiRouter.get("/providers", AIController.listProviders);
