const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const logFolderLocation = path.join(path.dirname(require.main.filename || process.mainModule.filename), "logs");
const moment = require("moment");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json()),
    transports: [
        // - Write to all logs with level `info` and below to `combined.log`
        new winston.transports.DailyRotateFile({
            filename: path.join(logFolderLocation, `info-%DATE%.log`),
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d"
        }),
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: path.join(logFolderLocation, `error.log`), level: "error" })
    ],
    exceptionHandlers: [new winston.transports.File({ filename: path.join(logFolderLocation, "exceptions.log") })]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple())
        })
    );
}

module.exports = logger;
