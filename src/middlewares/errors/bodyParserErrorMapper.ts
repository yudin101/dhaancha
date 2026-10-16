import type { MappedError, BodyParserError } from "../../types/error.js";

const isBodyParserError = (err: unknown): err is BodyParserError =>
  typeof err === "object" &&
  err !== null &&
  "type" in err &&
  typeof (err as { type: unknown }).type === "string";

const mapBodyParserError = (error: unknown): MappedError | null => {
  if (!isBodyParserError(error)) {
    return null;
  }

  switch (error.type) {
    case "entity.parse.failed": {
      return {
        status: 400,
        error: "Invalid JSON in request body",
        code: "INVALID_JSON_BODY",
      };
    }

    case "entity.too.large": {
      return {
        status: 413,
        error: "Request body is too large",
        code: "PAYLOAD_TOO_LARGE",
      };
    }

    case "encoding.unsupported":
    case "charset.unsupported": {
      return {
        status: 415,
        error: "Unsupported encoding",
        code: "UNSUPPORTED_ENCODING",
      };
    }

    case "request.aborted": {
      return {
        status: 400,
        error: "Request was aborted before it finished",
        code: "REQUEST_ABORTED",
      };
    }

    case "request.size.invalid":
    case "stream.encoding.set":
    case "parameters.too.many": {
      return {
        status: 400,
        error: "Invalid request body",
        code: "INVALID_REQUEST_BODY",
      };
    }

    default: {
      return null;
    }
  }
};

export default mapBodyParserError;
