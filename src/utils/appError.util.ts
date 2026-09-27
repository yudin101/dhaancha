// To handle errors that come from functions other than handlers
class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(
    message: string,
    code = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export default AppError;
