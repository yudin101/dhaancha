import type { PgError, MappedError } from "../../types/error.js";

const isPgError = (err: unknown): err is PgError =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  typeof (err as { code: unknown }).code === "string";

const extractField = (detail?: string): string =>
  detail?.match(/Key \((?<field>.*?)\)=/)?.groups?.field ?? "field";

const extractTable = (detail?: string): string =>
  detail?.match(/from table "(?<table>.*?)"/)?.groups?.table ??
  "another record";

const mapPgError = (error: unknown): MappedError | null => {
  const pgError = (error instanceof Error ? error.cause : undefined) ?? error;

  if (!isPgError(pgError)) {
    return null;
  }

  const detail = pgError.detail ?? "";

  switch (pgError.code) {
    // unique_violation
    case "23505": {
      return {
        status: 409,
        error: `${extractField(detail)} already exists.`,
        code: "UNIQUE_CONSTRAINT_VIOLATION",
      };
    }

    // foreign_key_violation
    case "23503": {
      if (detail.includes("is still referenced from table")) {
        return {
          status: 409,
          error: `Cannot delete: still referenced by ${extractTable(detail)}.`,
          code: "FOREIGN_KEY_IN_USE",
        };
      }
      return {
        status: 409,
        error: `${extractField(detail)} does not exist.`,
        code: "FOREIGN_KEY_VIOLATION",
      };
    }

    // not_null_violation
    case "23502": {
      return {
        status: 400,
        error: `${pgError.column ?? "field"} is required.`,
        code: "NOT_NULL_VIOLATION",
      };
    }

    // invalid_text_representation (e.g. malformed uuid)
    case "22P02": {
      return {
        status: 400,
        error: "Invalid value provided.",
        code: "INVALID_INPUT",
      };
    }

    default: {
      return null;
    }
  }
};

export default mapPgError;
