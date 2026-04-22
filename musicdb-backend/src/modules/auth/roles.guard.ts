import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // In a real app, we'd fetch the user from DB to ensure role is up to date,
    // but for now we assume the JWT strategy populates the user object correctly or we fetch it here.
    // The JWT payload typically contains the role.
    // See jwt.strategy.ts - we might need to ensure role is in the payload or fetch user here.
    // For this MVP, let's look at the request.user (User entity or payload)

    return roles.some((role) => user?.role === role);
  }
}
