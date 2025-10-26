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

  private static readonly REDACTION = '[REDACTED]'
  private static buildSensitiveKeys(): Set<string> {
    const defaults = [
      'password',
      'pass',
      'pwd',
      'token',
      'access_token',
      'access-token',
      'refreshtoken',
      'refresh_token',
      'refresh-token',
      'authorization',
      'api_key',
      'api-key',
      'x-api-key',
      'secret',
      'client_secret',
      'client-secret',
      'creditcard',
      'cardnumber',
      'cvv',
      'ssn',
      'otp',
      'pin',
      'cookie',
      'set-cookie',
    ]
    const extra = (process.env.LOG_SENSITIVE_KEYS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    return new Set<string>([...defaults, ...extra])
  }
  private static readonly SENSITIVE_KEYS = LoggingInterceptor.buildSensitiveKeys()

  // Deeply redacts values for any key that matches the sensitive keys list (case-insensitive)
  private redactDeep(value: unknown): unknown {
    const sensitive = LoggingInterceptor.SENSITIVE_KEYS

    const isPojo = (v: unknown) => Object.prototype.toString.call(v) === '[object Object]'

    if (Array.isArray(value)) {
      return (value as unknown[]).map((v) => this.redactDeep(v))
    }
    if (isPojo(value)) {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (sensitive.has(k.toLowerCase())) {
          out[k] = LoggingInterceptor.REDACTION
        } else {
          out[k] = this.redactDeep(v)
        }
      }
      return out
    }
    return value
  }

  private maskToken(str: string): string {
    if (typeof str !== 'string') return LoggingInterceptor.REDACTION
    // Keep the last 4 chars to help debugging without exposing token
    const visible = 4
    if (str.length <= visible) return LoggingInterceptor.REDACTION
    return `${'*'.repeat(Math.max(0, str.length - visible))}${str.slice(-visible)}`
  }

  private redactHeaders(headers: unknown = {}): Record<string, unknown> {
    try {
      const result: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(headers as Record<string, unknown>)) {
        const lower = key.toLowerCase()
        if (LoggingInterceptor.SENSITIVE_KEYS.has(lower)) {
          if (lower === 'authorization' && typeof val === 'string') {
            // Mask token while preserving scheme
            const parts = val.split(' ')
            if (parts.length === 2) {
              result[key] = `${parts[0]} ${this.maskToken(parts[1])}`
            } else {
              result[key] = this.maskToken(val)
            }
          } else if ((lower === 'cookie' || lower === 'set-cookie') && typeof val === 'string') {
            result[key] = LoggingInterceptor.REDACTION
          } else {
            result[key] = LoggingInterceptor.REDACTION
          }
        } else {
          result[key] = val
        }
      }
      return result
    } catch {
      return { headers: 'unavailable' }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const { method, originalUrl, params, query, body, headers } = req
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
      tap((data) => {
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
