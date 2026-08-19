import { Request, Response, NextFunction } from "express";
import { auditLogger } from "../config/auditLogger.config.js";

// In the current setup, "req.params.id" will automatically be logged
export const logUserAction = (
  actionDescription: string,
  allowedKeys: string[] = [],
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Intercept response finish to ensure the action actually succeeded
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let fieldsToLog: Record<string, any> = {};

        // Check if allowedKeys has anything and req.body exists
        // Filter out the entries from req.body which allowedKeys has
        // Don't include any values which are undefined
        if (allowedKeys.length > 0 && req.body) {
          const filteredEntries = Object.entries(req.body).filter(
            ([key, val]) => allowedKeys.includes(key) && val !== undefined,
          );
          fieldsToLog = Object.fromEntries(filteredEntries);
        }

        auditLogger.info({
          initiator: {
            ip: req.ip,
          },
          request: {
            action: actionDescription,
            method: req.method,
            url: req.originalUrl,
            targetId: req.params.id ?? null,
            ...(Object.keys(fieldsToLog).length > 0 && {
              body: fieldsToLog,
            }),
          },
          response: {
            status: res.statusCode,
          },
        });
      }
    });
    next();
  };
};
