import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError.util.js";
import mapKnownError from "./index.js";

// 404 Handler
export const handle404 = (req: Request, res: Response) => {
  res.status(404).json({
    error: `${req.method} - ${req.originalUrl} Not Found`,
    code: "NOT_FOUND",
  });
};

// Global Error Handler
// Triggers if there occurred any error that was not handled in the controllers
// oxlint-disable-next-line eslint/max-params
export const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  }

  const mapped = mapKnownError(error);
  if (mapped) {
    if (mapped.status >= 500) {
      console.error(error);
    }

    return res.status(mapped.status).json({
      error: mapped.error,
      code: mapped.code,
    });
  }

  // For when we have no idea what happened
  console.error(error);
  res.status(500).json({
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
