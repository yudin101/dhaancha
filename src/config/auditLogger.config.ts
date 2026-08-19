import winston, { Logger } from "winston";

const { combine, timestamp, json } = winston.format;

export const auditLogger: Logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [new winston.transports.File({ filename: "logs/audit.log" })],
});
