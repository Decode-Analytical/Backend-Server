// import {
//     createLogger,
//     format as _format,
//     transports as _transports,
//   } from "winston";
const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, label, prettyPrint } = format;
const logFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.prettyPrint(),
  format.printf(({ timestamp, level, message, service }) => {
    return `[${timestamp}] ${service ?? ""} ${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "error.log" })],
  rejectionHandlers: [new transports.File({ filename: "error.log" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: logFormat,
    })
  );
}

module.exports = logger;
