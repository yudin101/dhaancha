import type { NextFunction, Request, Response } from "express";

// For logging each request
// Example output:
// GET - /api/v1/employee?query=Test
const log = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

export default log;
