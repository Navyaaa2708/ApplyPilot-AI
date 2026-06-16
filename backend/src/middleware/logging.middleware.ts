import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const elapsed = Date.now() - start;
    // eslint-disable-next-line no-console
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`);
  });
  next();
}
