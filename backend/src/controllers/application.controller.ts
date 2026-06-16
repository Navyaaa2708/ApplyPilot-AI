import { Request, Response } from "express";
import { ApplicationService } from "../services/application.service.js";

export class ApplicationController {
  static async create(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const application = await ApplicationService.create(userId, req.body);
    return res.status(201).json({ data: application });
  }

  static async list(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const applications = await ApplicationService.list(userId);
    return res.status(200).json({ data: applications });
  }

  static async update(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const application = await ApplicationService.update(userId, req.params.id, req.body);
    return res.status(200).json({ data: application });
  }

  static async remove(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    await ApplicationService.remove(userId, req.params.id);
    return res.status(204).send();
  }
}
