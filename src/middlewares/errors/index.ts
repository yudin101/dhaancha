import mapPgError from "./pgErrorMapper.js";
import mapUpstreamError from "./upstreamErrorMapper.js";
import bodyParserError from "./bodyParserErrorMapper.js";
import type { MappedError } from "../../types/error.js";

const mappers: ((error: unknown) => MappedError | null)[] = [
  mapPgError,
  mapUpstreamError,
  bodyParserError,
];

const mapKnownError = (error: unknown): MappedError | null => {
  for (const mapper of mappers) {
    const mapped = mapper(error);
    if (mapped) {
      return mapped;
    }
  }
  return null;
};

export default mapKnownError;
