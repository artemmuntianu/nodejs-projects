const w = require('winston');
require('winston-daily-rotate-file');

const format = w.format.combine(
    w.format.timestamp(),
    w.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

module.exports.log = w.createLogger({
    format: format,
    transports: [
        new w.transports.DailyRotateFile({
            json: false,
            level: 'info',
            filename: './logs/success.log',
        }),
        new w.transports.DailyRotateFile({
            json: false,
            level: 'error',
            filename: './logs/error.log',
            handleExceptions: true
        }),
        new w.transports.Console()
    ]
});