import { Request, Response } from "express";
import { ResumeService } from "../services/resume.service.js";

export class ResumeController {
  static async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required." });
    }
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const result = await ResumeService.parseAndStore(userId, req.file);
    return res.status(201).json({ data: result });
  }

  static async list(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const resumes = await ResumeService.listForUser(userId);
    return res.status(200).json({ data: resumes });
  }

  static async getById(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const resume = await ResumeService.getById(userId, req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found." });
    }
    return res.status(200).json({ data: resume });
  }

  static async optimize(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const result = await ResumeService.optimize(userId, req.params.id, req.body.jobDescription);
    return res.status(200).json({ data: result });
  }

  static async export(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const response = await ResumeService.exportResume(userId, req.params.id, req.body.format || "pdf");
    return res.status(200).json(response);
  }
}
