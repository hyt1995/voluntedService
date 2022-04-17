const date = require("date-and-time");
const config = require("../config");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");



const logger = winston.createLogger({
    level:  process.env.LOGLEVEL ? process.env.LOGLEVEL : config.loglevel,
    transports: [
        new DailyRotateFile({
            filename : './log/%DATE%.log', // log 폴더에 system.log 이름으로 저장
            datePattern : 'YYYY-MM-DD',
            zippedArchive: true, // 압축여부
            format : winston.format.printf(
                info => `${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
            )
        }),
        new winston.transports.Console({
            format: winston.format.printf(
                info => `${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
            )
        })
    ]
});

module.exports = logger;