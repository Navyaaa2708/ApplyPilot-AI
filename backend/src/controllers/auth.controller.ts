import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async signup(req: Request, res: Response) {
    const { email, password, fullName } = req.body;
    const result = await AuthService.signup({ email, password, fullName });
    return res.status(201).json(result);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    return res.status(200).json(result);
  }

  static async logout(_req: Request, res: Response) {
    return res.status(200).json({ success: true });
  }

  static async me(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ data: user });
  }
}
