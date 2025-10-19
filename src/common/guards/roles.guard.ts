import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { Role } from '../enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) return true

    const request = context.switchToHttp().getRequest()
    const client = request.client

    if (!client || !requiredRoles.includes(client.role)) {
      throw new ForbiddenException(`You need one of these roles: ${requiredRoles.join(', ')}`)
    }

    return true
  }
}
