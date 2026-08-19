import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util.js";
import { checkDatabaseConnection } from "../db/index.js";

// Returns 200 when both the API server and DB server are up
export const handleHealthCheck = catchAsync(
  async (_req: Request, res: Response): Promise<Response> => {
    await checkDatabaseConnection();
    return res.status(200).json({
      message: "Healthy",
      status: 200,
    });
  },
);
