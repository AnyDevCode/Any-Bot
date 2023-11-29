import { createLogger, format, transports } from "winston";
import path from "node:path";
import stringify from "json-stringify-safe";

// Custom log formatting
const logFormat = format.printf((info) => {
  const { timestamp, level, label, message, ...rest } = info;
  let log = `${timestamp} - ${level} [${label}]: ${message}`;

  // Check if rest is an object
  if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
    log = `${log}\n${stringify(rest, null, 2)}`.replace(/\\n/g, "\n");
  }
  return log;
});

/**
 * Create a new logger
 */
const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: "Bot" }),
    format.timestamp({ format: "(YYYY/MM/DD) HH:mm:ss" })
  ),
  transports: [
    // Logging to console
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
      handleExceptions: true,
    }),
    // Logging info and up to file
    new transports.File({
      filename: path.join("../../logs/full.log"),
      level: "info",
      format: logFormat,
      options: { flags: "w" },
    }),
    // Logging only warns and errors to file
    new transports.File({
      filename: path.join("../../logs/error.log"),
      level: "warn",
      format: logFormat,
      options: { flags: "w" },
    }),
  ],
});

export { logger };
