import {
  CanActivate,
  ExecutionContext,
  SetMetadata,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!request.user) {
      return false;
    }
    return roles.some((role) => role === request.user.role);
  }
}
