export interface MappedError {
  status: number;
  error: string;
  code: string;
}

export interface UndiciError {
  code: string;
  message: string;
}

export interface NodeSystemError {
  code: string;
  errno: number;
  syscall: string;
  address?: string;
  port?: number;
}

export interface PgError {
  code?: string;
  detail?: string;
  column?: string;
  constraint?: string;
  table?: string;
  cause?: unknown;
}

export interface BodyParserError {
  type?: string;
  message?: string;
  status?: number;
}
