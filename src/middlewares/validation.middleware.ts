import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";

interface ParsedRequest {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

// For validating Zod schemas
const validate =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as ParsedRequest;

      if (parsed.query) {
        Object.assign(req.query, parsed.query);
      }
      if (parsed.body) {
        Object.assign(req.body, parsed.body);
      }
      if (parsed.params) {
        Object.assign(req.params, parsed.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
          code: "VALIDATION_ERROR",
        });
      }
      return next(error);
    }
  };

export default validate;
