import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.util.js";

// 404 Handler
export const handle404 = (req: Request, res: Response) => {
  res.status(404).json({
    error: `${req.method} - ${req.originalUrl} Not Found`,
    code: "NOT_FOUND",
  });
};

// Global Error Handler
// Triggers if there occured any error that was not handled in the controllers
export const globalErrorHandler = (
  error: any,
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
  if (error.type === "entity.parse.failed") {
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
