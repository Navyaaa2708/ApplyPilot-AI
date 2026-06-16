import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = (err as any)?.status || 500;
  res.status(status).json({ error: (err as any)?.message || "Internal server error." });
}
