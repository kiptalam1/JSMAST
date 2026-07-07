import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../deccorators/roles.decorator';
import { User, UserRole } from '../entities/user.entity';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  CanActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const hasRequiredRole = roles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}
