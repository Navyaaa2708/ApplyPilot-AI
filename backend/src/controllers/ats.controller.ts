import { Request, Response } from "express";
import { ATSService } from "../services/ats.service.js";

export class ATSController {
  static async score(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const result = await ATSService.score(userId, req.body.resumeId, req.body.jobDescription);
    return res.status(200).json({ data: result });
  }

  static async explain(req: Request, res: Response) {
    const explanation = await ATSService.explain(String(req.params.id));
    return res.status(200).json({ data: explanation });
  }
}
