import { Controller, Get, Query, BadRequestException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Controller('logs')
export class LogSearchController {
  private readonly logDir = path.join(process.cwd(), 'logs')

  @Get('search')
  searchLogs(@Query('q') query: string): string[] {
    if (!query) throw new BadRequestException('Missing search query')

    const logFiles = fs
      .readdirSync(this.logDir)
      .filter((f) => f.endsWith('.log'))
      .sort()
      .reverse()

    if (logFiles.length === 0) throw new BadRequestException('No log files found')

    const latestLogPath = path.join(this.logDir, logFiles[0])
    const logContent = fs.readFileSync(latestLogPath, 'utf-8')

    const lines = logContent.split('\n').filter((line) => line.includes(query))

    return lines.slice(-50)
  }
}
