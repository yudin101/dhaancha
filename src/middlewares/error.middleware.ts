import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.util.js";

// 404 Handler
export const handle404 = (req: Request, res: Response) => {
  res.status(404).json({
    error: `${req.method} - ${req.originalUrl} Not Found`,
    code: "NOT_FOUND",
  });
};

export interface BodyParserError {
  type?: string;
  message?: string;
  status?: number;
}

// Body Parser Error
// For things like invalid JSON in request
const isBodyParserError = (err: unknown): err is BodyParserError =>
  typeof err === "object" &&
  err !== null &&
  "type" in err &&
  typeof (err as { type: unknown }).type === "string";

// Global Error Handler
// Triggers if there occured any error that was not handled in the controllers
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

  // Handling invalid JSON
  if (isBodyParserError(error) && error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON in request body",
      code: "INVALID_JSON_BODY",
    });
  }

  console.error(error);
  res.status(500).json({
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
