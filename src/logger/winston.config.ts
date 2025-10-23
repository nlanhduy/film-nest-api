/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import LokiTransport from 'winston-loki'

// Loki configuration
const lokiEnabled=process.env.LOKI_ENABLED === 'true'
const lokiHost=process.env.LOKI_HOST || 'http://localhost:3100'
// 🪄 custom format cho file log
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`
  }),
)

const transports: winston.transport[]=[
  new winston.transports.Console({
    format:winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike('FilmAPI', { prettyPrint: true }),
    )
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

]

// Add Loki transport if enabled
if (lokiEnabled) {
  transports.push(
    new LokiTransport({
      host: lokiHost,
      labels: { 
        app: 'film-nest-api',
        environment: process.env.NODE_ENV || 'development'
      },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki connection error:', err),
    }),
  )
}

export const winstonConfig: winston.LoggerOptions = {
  transports,
}