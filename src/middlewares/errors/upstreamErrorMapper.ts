import type {
  MappedError,
  UndiciError,
  NodeSystemError,
} from "../../types/error.js";

const UPSTREAM_UNAVAILABLE: MappedError = {
  status: 502,
  error: "Failed to reach an upstream service.",
  code: "UPSTREAM_UNAVAILABLE",
};

const UPSTREAM_TIMEOUT: MappedError = {
  status: 504,
  error: "The upstream service took too long to respond.",
  code: "UPSTREAM_TIMEOUT",
};

const NETWORK_UNREACHABLE_CODES = new Set([
  "ENETUNREACH",
  "EHOSTUNREACH",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
]);

// For errors thrown by fetch functions
const isUndiciError = (err: unknown): err is UndiciError =>
  err instanceof Error &&
  "code" in err &&
  typeof (err as { code: unknown }).code === "string" &&
  (err as { code: string }).code.startsWith("UND_ERR_");

// Errors thrown by node itself
const isNodeSystemError = (err: unknown): err is NodeSystemError =>
  err instanceof Error &&
  "code" in err &&
  "errno" in err &&
  "syscall" in err &&
  typeof (err as { code: unknown }).code === "string";

const mapUpstreamError = (error: unknown): MappedError | null => {
  const cause = error instanceof Error ? error.cause : undefined;

  // Node network errors (ECONNREFUSED, ENOTFOUND, ...)
  if (isNodeSystemError(cause) && NETWORK_UNREACHABLE_CODES.has(cause.code)) {
    return UPSTREAM_UNAVAILABLE;
  }

  // undici (fetch) errors, e.g. the attendance machine
  if (isUndiciError(cause)) {
    return cause.code === "UND_ERR_CONNECT_TIMEOUT"
      ? UPSTREAM_TIMEOUT
      : UPSTREAM_UNAVAILABLE;
  }

  return null;
};

export default mapUpstreamError;
