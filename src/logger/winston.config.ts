/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

// 🪄 custom format cho file log
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`
  }),
)

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('FilmAPI', { prettyPrint: true }),
      ),
    }),

    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '7d',
      level: 'info',
      format: fileFormat,
    }),
  ],
}
