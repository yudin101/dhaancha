import rateLimit from "express-rate-limit";

// Send only 100 requests every 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
    code: "RATE_LIMITED",
  },
});

// Send only 10 requests every 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later.",
    code: "RATE_LIMITED",
  },
});
