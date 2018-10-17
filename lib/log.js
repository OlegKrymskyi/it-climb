'use strict';
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            maxsize: 5242880, //5MB
            maxFiles: 5,
            prepend: true,
            level: 'info'
        })
    ]
});

module.exports = logger;