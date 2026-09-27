import winston, { type Logger } from "winston";

const { combine, timestamp, json } = winston.format;

const auditLogger: Logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [new winston.transports.File({ filename: "logs/audit.log" })],
});

export default auditLogger;
