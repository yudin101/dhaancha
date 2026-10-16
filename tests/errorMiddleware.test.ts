import type { NextFunction, Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  globalErrorHandler,
  handle404,
} from "../src/middlewares/errors/error.middleware.js";
import AppError from "../src/utils/appError.util.js";

const makeResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response & typeof res;
};

const invokeErrorHandler = (error: unknown) => {
  const res = makeResponse();
  globalErrorHandler(error, {} as Request, res, vi.fn() as NextFunction);
  return res;
};

describe("error middleware", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns AppError status, message, and code", () => {
    const res = invokeErrorHandler(
      new AppError("Not allowed", "FORBIDDEN", 403),
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Not allowed",
      code: "FORBIDDEN",
    });
  });

  it("maps PostgreSQL uniqueness errors", () => {
    const res = invokeErrorHandler(
      new Error("Database operation failed", {
        cause: {
          code: "23505",
          detail: "Key (email)=(person@example.com) already exists.",
        },
      }),
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "email already exists.",
      code: "UNIQUE_CONSTRAINT_VIOLATION",
    });
  });

  it("maps upstream connection failures and logs server errors", () => {
    const error = new Error("Attendance request failed", {
      cause: Object.assign(new Error("Connection refused"), {
        code: "ECONNREFUSED",
        errno: -111,
        syscall: "connect",
      }),
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = invokeErrorHandler(error);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to reach an upstream service.",
      code: "UPSTREAM_UNAVAILABLE",
    });
    expect(log).toHaveBeenCalledWith(error);
  });

  it("maps malformed JSON request bodies", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = invokeErrorHandler({ type: "entity.parse.failed" });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid JSON in request body",
      code: "INVALID_JSON_BODY",
    });
    expect(log).not.toHaveBeenCalled();
  });

  it("returns a generic response and logs unknown errors", () => {
    const error = new Error("Sensitive internal details");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = invokeErrorHandler(error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({ error: error.message }),
    );
    expect(log).toHaveBeenCalledWith(error);
  });

  it("formats the 404 response with the request method and URL", () => {
    const res = makeResponse();

    handle404(
      { method: "GET", originalUrl: "/api/v1/missing" } as Request,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "GET - /api/v1/missing Not Found",
      code: "NOT_FOUND",
    });
  });
});
