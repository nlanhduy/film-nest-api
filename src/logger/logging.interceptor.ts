/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { catchError, Observable, tap } from 'rxjs';
import { Logger } from 'winston';

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const { method, originalUrl, params, query, body } = req
    const start = Date.now()

    // Sanitize sensitive fields before logging
    const sanitizedBody = this.sanitize(body)
    const sanitizedParams = this.sanitize(params)
    const sanitizedQuery = this.sanitize(query)

    this.logger.info(`Incoming Request: ${method} ${originalUrl}`, {
      params: sanitizedParams,
      query: sanitizedQuery,
      body: sanitizedBody,
    })

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start
        this.logger.info(
          `Response: ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`
        )
      }),
      catchError((err) => {
        const duration = Date.now() - start
        const statusCode = err.status || 500
        this.logger.error(
          `Error: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
          { error: err.message }
        )
        throw err
      })
    )
  }

  /**
   * Redacts sensitive fields from an object
   */
  private sanitize(obj: Record<string, any> = {}): Record<string, any> {
    const sensitiveKeys = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'authorization',
      'secret',
      'apiKey',
    ]

    const clone: Record<string, any> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
          clone[key] = '[REDACTED]'
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          clone[key] = this.sanitize(obj[key]) // recursively sanitize
        } else {
          clone[key] = obj[key]
        }
      }
    }
    return clone
  }
}
