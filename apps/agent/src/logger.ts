import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

const LOG_DIR = path.resolve(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf((info) => {
  const { level, message, timestamp: ts, stack } = info as {
    level: string;
    message: string;
    timestamp: string;
    stack?: string;
  };
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  return stack ? `${base}\n${stack}` : base;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // File transport
    new winston.transports.File({
      filename: path.join(LOG_DIR, "agent.log"),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
      tailable: true,
    }),
    // Console transport (colorized)
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});
