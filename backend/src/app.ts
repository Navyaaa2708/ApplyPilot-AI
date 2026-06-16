import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { json, urlencoded } from "express";
import { authRouter } from "./routes/auth.routes.js";
import { resumeRouter } from "./routes/resume.routes.js";
import { atsRouter } from "./routes/ats.routes.js";
import { applicationRouter } from "./routes/application.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logging.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";

export const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);

const apiLimiter = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use(apiLimiter);

app.get("/api/healthz", (_req, res) => res.status(200).json({ status: "ok", uptime: process.uptime() }));

app.use("/api/auth", authRouter);
app.use("/api/resumes", authenticate, resumeRouter);
app.use("/api/ats", authenticate, atsRouter);
app.use("/api/applications", authenticate, applicationRouter);
app.use("/api/ai", authenticate, aiRouter);

app.use(errorHandler);
