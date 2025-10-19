import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { CLIENT_API_KEYS } from 'src/common/api-keys'

@Injectable()
export class ClientAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string

    if (!apiKey || !CLIENT_API_KEYS[apiKey]) {
      throw new UnauthorizedException('Invalid or missing API key')
    }

    req['client'] = CLIENT_API_KEYS[apiKey]
    next()
  }
}
