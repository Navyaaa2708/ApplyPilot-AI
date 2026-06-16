import { Request, Response } from "express";
import { AIService } from "../services/ai.service.js";

export class AIController {
  static async generateCoverLetter(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const result = await AIService.generateCoverLetter(userId, req.body);
    return res.status(200).json({ data: result });
  }

  static async connectLocalProvider(req: Request, res: Response) {
    const result = await AIService.validateLocalProvider(req.body.endpoint, req.body.model);
    return res.status(200).json({ data: result });
  }

  static async listProviders(_req: Request, res: Response) {
    const providers = await AIService.listProviders();
    return res.status(200).json({ data: providers });
  }
}
