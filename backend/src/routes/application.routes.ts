import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";

export const applicationRouter = Router();

applicationRouter.post("/", ApplicationController.create);
applicationRouter.get("/", ApplicationController.list);
applicationRouter.put("/:id", ApplicationController.update);
applicationRouter.delete("/:id", ApplicationController.remove);
