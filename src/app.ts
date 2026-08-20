import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { log } from "./middlewares/log.middleware.js";
import { authRouter, generalRouter } from "./routes/index.js";
import {
  globalErrorHandler,
  handle404,
} from "./middlewares/error.middleware.js";
import {
  generalLimiter,
  authLimiter,
} from "./middlewares/rateLimit.middleware.js";
import env from "./config/env.config.js";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(log);
app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1", generalLimiter, generalRouter);
app.use(handle404);
app.use(globalErrorHandler);

export default app;
