import { Router } from "express";
import multer from "multer";
import { ResumeController } from "../controllers/resume.controller.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
export const resumeRouter = Router();

resumeRouter.post("/upload", upload.single("resume"), ResumeController.upload);
resumeRouter.get("/", ResumeController.list);
resumeRouter.get("/:id", ResumeController.getById);
resumeRouter.post("/:id/optimize", ResumeController.optimize);
resumeRouter.post("/:id/export", ResumeController.export);
