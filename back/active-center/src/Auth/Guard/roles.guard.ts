/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/User/UserDTO/Role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRol: Role[] = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const userRoles: Role[] = context.switchToHttp().getRequest()?.access.roles;
    const hasRequiredRole: boolean = requireRol.some((rol) =>
      userRoles.includes(rol),
    );
    if (!hasRequiredRole)
      throw new ForbiddenException('No cuentas con el permiso necesario.');
    return true;
  }
}
